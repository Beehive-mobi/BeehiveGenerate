"use server"

import { revalidatePath } from "next/cache"
import { saveProject, deleteProject, getProjectById } from "@/app/lib/db"

export async function createProject(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const framework = formData.get("framework") as string

    if (!name) {
      return { success: false, message: "Project name is required" }
    }

    const response = await fetch("https://api.vercel.com/v9/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      },
      body: JSON.stringify({
        name,
        framework: framework || "nextjs",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error?.message || "Failed to create project",
      }
    }

    // Save project to database
    const saveResult = await saveProject({
      vercel_id: data.id,
      name: data.name,
      framework: data.framework,
      response_data: data,
    })

    if (!saveResult.success) {
      console.error("Failed to save project to database:", saveResult.error)
      // Continue anyway since the Vercel project was created successfully
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/projects")
    return { success: true, message: "Project created successfully", project: data }
  } catch (error) {
    console.error("Error creating project:", error)
    return { success: false, message: "An error occurred while creating the project" }
  }
}

export async function fetchProjectDetails(id: number) {
  try {
    const result = await getProjectById(id)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to fetch project" }
    }

    // Optionally fetch latest data from Vercel API
    try {
      const vercelId = result.project.vercel_id
      const response = await fetch(`https://api.vercel.com/v9/projects/${vercelId}`, {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
      })

      if (response.ok) {
        const vercelData = await response.json()

        // Update our database with the latest data
        await saveProject({
          vercel_id: vercelData.id,
          name: vercelData.name,
          framework: vercelData.framework,
          response_data: vercelData,
        })

        return { success: true, project: { ...result.project, vercel_data: vercelData } }
      }
    } catch (vercelError) {
      console.error("Error fetching from Vercel API:", vercelError)
      // Continue with our database data
    }

    return { success: true, project: result.project }
  } catch (error) {
    console.error("Error fetching project details:", error)
    return { success: false, message: "An error occurred while fetching project details" }
  }
}

export async function removeProject(id: number) {
  try {
    // First get the project to get the Vercel ID
    const projectResult = await getProjectById(id)

    if (!projectResult.success) {
      return { success: false, message: "Project not found" }
    }

    const vercelId = projectResult.project.vercel_id

    // Delete from Vercel
    try {
      const response = await fetch(`https://api.vercel.com/v9/projects/${vercelId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error deleting project from Vercel:", errorData)
        // Continue with database deletion anyway
      }
    } catch (vercelError) {
      console.error("Error deleting from Vercel API:", vercelError)
      // Continue with database deletion
    }

    // Delete from our database
    const result = await deleteProject(id)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to delete project" }
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/projects")
    return { success: true, message: "Project deleted successfully" }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, message: "An error occurred while deleting the project" }
  }
}

