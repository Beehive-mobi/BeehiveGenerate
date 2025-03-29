"use server"

import { revalidatePath } from "next/cache"
import {
  saveDomain,
  getDomainById,
  getDomainsByProject,
  getDomainByName,
  deleteDomain,
  getProjectById,
  getDeploymentById,
} from "@/app/lib/db"

export async function fetchDomainsByProject(projectId: number) {
  try {
    const result = await getDomainsByProject(projectId)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to fetch domains" }
    }

    return { success: true, domains: result.domains }
  } catch (error) {
    console.error("Error fetching domains:", error)
    return { success: false, message: "An error occurred while fetching domains" }
  }
}

export async function fetchDomainDetails(id: number) {
  try {
    const result = await getDomainById(id)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to fetch domain" }
    }

    // Optionally fetch latest data from Vercel API
    try {
      const domainName = result.domain.name
      const response = await fetch(
        `https://api.vercel.com/v9/projects/${result.domain.response_data.projectId}/domains/${domainName}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          },
        },
      )

      if (response.ok) {
        const vercelData = await response.json()

        // Update our database with the latest data
        await saveDomain({
          id: result.domain.id,
          project_id: result.domain.project_id,
          deployment_id: result.domain.deployment_id,
          name: domainName,
          verified: vercelData.verified || result.domain.verified,
          response_data: vercelData,
        })

        return { success: true, domain: { ...result.domain, vercel_data: vercelData } }
      }
    } catch (vercelError) {
      console.error("Error fetching from Vercel API:", vercelError)
      // Continue with our database data
    }

    return { success: true, domain: result.domain }
  } catch (error) {
    console.error("Error fetching domain details:", error)
    return { success: false, message: "An error occurred while fetching domain details" }
  }
}

export async function addDomain(formData: FormData) {
  try {
    const projectId = Number(formData.get("project_id"))
    const deploymentId = formData.get("deployment_id") ? Number(formData.get("deployment_id")) : undefined
    const name = (formData.get("name") as string).trim()

    if (!projectId) {
      return { success: false, message: "Project ID is required" }
    }

    if (!name) {
      return { success: false, message: "Domain name is required" }
    }

    // Check if domain already exists in our database
    const existingDomain = await getDomainByName(name)
    if (existingDomain.success) {
      return { success: false, message: "Domain already exists" }
    }

    // Get project details
    const projectResult = await getProjectById(projectId)
    if (!projectResult.success) {
      return { success: false, message: "Project not found" }
    }

    const vercelProjectId = projectResult.project.vercel_id

    // Add domain to Vercel
    const response = await fetch(`https://api.vercel.com/v9/projects/${vercelProjectId}/domains`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      },
      body: JSON.stringify({ name }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error?.message || "Failed to add domain",
      }
    }

    // Save domain to our database
    const saveResult = await saveDomain({
      project_id: projectId,
      deployment_id: deploymentId,
      name,
      verified: data.verified || false,
      response_data: data,
    })

    if (!saveResult.success) {
      console.error("Failed to save domain to database:", saveResult.error)
      // Continue anyway since the Vercel domain was added successfully
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    revalidatePath(`/dashboard/projects/${projectId}/domains`)

    return { success: true, message: "Domain added successfully", domain: data }
  } catch (error) {
    console.error("Error adding domain:", error)
    return { success: false, message: "An error occurred while adding the domain" }
  }
}

export async function verifyDomain(id: number) {
  try {
    const domainResult = await getDomainById(id)

    if (!domainResult.success) {
      return { success: false, message: "Domain not found" }
    }

    const domain = domainResult.domain
    const projectResult = await getProjectById(domain.project_id)

    if (!projectResult.success) {
      return { success: false, message: "Project not found" }
    }

    const vercelProjectId = projectResult.project.vercel_id

    // Verify domain on Vercel
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${vercelProjectId}/domains/${domain.name}/verify`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error?.message || "Failed to verify domain",
      }
    }

    // Update domain in our database
    await saveDomain({
      id: domain.id,
      project_id: domain.project_id,
      deployment_id: domain.deployment_id,
      name: domain.name,
      verified: data.verified || domain.verified,
      response_data: { ...domain.response_data, ...data },
    })

    revalidatePath(`/dashboard/projects/${domain.project_id}`)
    revalidatePath(`/dashboard/projects/${domain.project_id}/domains`)

    return { success: true, message: "Domain verification initiated", domain: data }
  } catch (error) {
    console.error("Error verifying domain:", error)
    return { success: false, message: "An error occurred while verifying the domain" }
  }
}

export async function removeDomain(id: number) {
  try {
    const domainResult = await getDomainById(id)

    if (!domainResult.success) {
      return { success: false, message: "Domain not found" }
    }

    const domain = domainResult.domain
    const projectResult = await getProjectById(domain.project_id)

    if (!projectResult.success) {
      return { success: false, message: "Project not found" }
    }

    const vercelProjectId = projectResult.project.vercel_id

    // Remove domain from Vercel
    try {
      const response = await fetch(`https://api.vercel.com/v9/projects/${vercelProjectId}/domains/${domain.name}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error removing domain from Vercel:", errorData)
        // Continue with database deletion anyway
      }
    } catch (vercelError) {
      console.error("Error removing from Vercel API:", vercelError)
      // Continue with database deletion
    }

    // Delete from our database
    const result = await deleteDomain(id)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to delete domain" }
    }

    revalidatePath(`/dashboard/projects/${domain.project_id}`)
    revalidatePath(`/dashboard/projects/${domain.project_id}/domains`)

    return { success: true, message: "Domain removed successfully" }
  } catch (error) {
    console.error("Error removing domain:", error)
    return { success: false, message: "An error occurred while removing the domain" }
  }
}

export async function assignDomainToDeployment(formData: FormData) {
  try {
    const domainId = Number(formData.get("domain_id"))
    const deploymentId = Number(formData.get("deployment_id"))

    if (!domainId || !deploymentId) {
      return { success: false, message: "Domain ID and Deployment ID are required" }
    }

    const domainResult = await getDomainById(domainId)
    if (!domainResult.success) {
      return { success: false, message: "Domain not found" }
    }

    const deploymentResult = await getDeploymentById(deploymentId)
    if (!deploymentResult.success) {
      return { success: false, message: "Deployment not found" }
    }

    const domain = domainResult.domain
    const deployment = deploymentResult.deployment

    // Ensure domain and deployment belong to the same project
    if (domain.project_id !== deployment.project_id) {
      return { success: false, message: "Domain and deployment must belong to the same project" }
    }

    // Update domain in Vercel to point to this deployment
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${domain.response_data.projectId}/domains/${domain.name}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
        body: JSON.stringify({
          deploymentId: deployment.deployment_id,
        }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error?.message || "Failed to assign domain to deployment",
      }
    }

    // Update domain in our database
    await saveDomain({
      id: domain.id,
      project_id: domain.project_id,
      deployment_id: deploymentId,
      name: domain.name,
      verified: domain.verified,
      response_data: { ...domain.response_data, ...data },
    })

    revalidatePath(`/dashboard/projects/${domain.project_id}`)
    revalidatePath(`/dashboard/projects/${domain.project_id}/domains`)
    revalidatePath(`/dashboard/projects/${domain.project_id}/deployments`)

    return { success: true, message: "Domain assigned to deployment successfully" }
  } catch (error) {
    console.error("Error assigning domain to deployment:", error)
    return { success: false, message: "An error occurred while assigning the domain to deployment" }
  }
}

