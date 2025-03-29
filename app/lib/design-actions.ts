"use server"
import { sql } from "./db"
// import type { WebsiteDesign, OnboardingData } from "./schema"

// export async function saveDesign(design: WebsiteDesign, onboardingData: OnboardingData) {
//   try {
//     const result = await sql`
//       INSERT INTO designs (
//         user_id,
//         company_name,
//         design_name,
//         description,
//         color_palette,
//         typography,
//         layout,
//         features,
//         image_style,
//         preview_images
//       ) VALUES (
//         'user123', -- Replace with actual user ID
//         ${onboardingData.company.companyName},
//         ${design.name},
//         ${design.description},
//         ${JSON.stringify(design.colorPalette)},
//         ${JSON.stringify(design.typography)},
//         ${JSON.stringify(design.layout)},
//         ${JSON.stringify(design.features)},
//         ${design.imageStyle},
//         ${JSON.stringify({
//           desktop: design.previewImage,
//           mobile: design.mobilePreviewImage,
//           tablet: design.tabletPreviewImage,
//         })}
//       )
//       RETURNING id
//     `

//     return { success: true, designId: result[0].id }
//   } catch (error) {
//     console.error("Error saving design:", error)
//     return { success: false, error }
//   }
// }

// export async function getDesigns() {
//   try {
//     const designs = await sql`
//       SELECT * FROM designs
//     `
//     return { success: true, designs }
//   } catch (error) {
//     console.error("Error fetching designs:", error)
//     return { success: false, error }
//   }
// }

// export async function getDesignById(id: string) {
//   try {
//     const design = await sql`
//       SELECT * FROM designs WHERE id = ${id}
//     `
//     if (design.length === 0) {
//       return { success: false, error: "Design not found" }
//     }
//     return { success: true, design: design[0] }
//   } catch (error) {
//     console.error("Error fetching design:", error)
//     return { success: false, error }
//   }
// }

// export async function deleteDesign(id: string) {
//   try {
//     await sql`
//       DELETE FROM designs WHERE id = ${id}
//     `
//     return { success: true }
//   } catch (error) {
//     console.error("Error deleting design:", error)
//     return { success: false, error }
//   }
// }



import { revalidatePath } from "next/cache"
import { getDesignsByProject, getDesignById, saveDesign, deleteDesign } from "@/app/lib/db"
import type { WebsiteDesign, OnboardingData } from "@/app/lib/schema"


export async function saveDesign1(project_id:number, design: WebsiteDesign, onboardingData: OnboardingData) {
    try {
      const result = await sql`
        INSERT INTO designs (
          user_id,
          project_id,
          company_name,
          design_name,
          description,
          color_palette,
          typography,
          layout,
          features,
          image_style,
          preview_images
        ) VALUES (
          'user123', -- Replace with actual user ID
          ${project_id},
          ${onboardingData.company.companyName},
          ${design.name},
          ${design.description},
          ${JSON.stringify(design.colorPalette)},
          ${JSON.stringify(design.typography)},
          ${JSON.stringify(design.layout)},
          ${JSON.stringify(design.features)},
          ${design.imageStyle},
          ${JSON.stringify({
            desktop: design.previewImage,
            mobile: design.mobilePreviewImage,
            tablet: design.tabletPreviewImage,
          })}
        )
        RETURNING id
      `
  
      return { success: true, designId: result[0].id }
    } catch (error) {
      console.error("Error saving design:", error)
      return { success: false, error }
    }
  }

export async function fetchDesignsByProject(projectId: number) {
  try {
    const result = await getDesignsByProject(projectId)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to fetch designs" }
    }

    return { success: true, designs: result.designs }
  } catch (error) {
    console.error("Error fetching designs:", error)
    return { success: false, message: "An error occurred while fetching designs" }
  }
}

export async function fetchDesignDetails(id: number) {
  try {
    const result = await getDesignById(id)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to fetch design" }
    }

    return { success: true, design: result.design }
  } catch (error) {
    console.error("Error fetching design details:", error)
    return { success: false, message: "An error occurred while fetching design details" }
  }
}

export async function createOrUpdateDesign(formData: FormData) {
  try {
    const id = formData.get("id") ? Number(formData.get("id")) : undefined
    const projectId = formData.get("project_id") ? Number(formData.get("project_id")) : undefined
    const companyName = formData.get("company_name") as string
    const designName = formData.get("design_name") as string
    const description = formData.get("description") as string

    if (!companyName || !designName) {
      return { success: false, message: "Company name and design name are required" }
    }

    const designData = {
      id,
      project_id: projectId,
      company_name: companyName,
      design_name: designName,
      description: description || undefined,
    }

    const result = await saveDesign(designData)

    if (!result.success) {
      return { success: false, message: "Failed to save design" }
    }

    revalidatePath("/dashboard/projects")
    if (projectId) {
      revalidatePath(`/dashboard/projects/${projectId}`)
      revalidatePath(`/dashboard/projects/${projectId}/designs`)
    }

    return { success: true, message: "Design saved successfully", design: result.design }
  } catch (error) {
    console.error("Error saving design:", error)
    return { success: false, message: "An error occurred while saving the design" }
  }
}

export async function removeDesign(id: number) {
  try {
    const designResult = await getDesignById(id)

    if (!designResult.success) {
      return { success: false, message: "Design not found" }
    }

    const projectId = designResult.design.project_id

    const result = await deleteDesign(id)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to delete design" }
    }

    revalidatePath("/dashboard/projects")
    if (projectId) {
      revalidatePath(`/dashboard/projects/${projectId}`)
      revalidatePath(`/dashboard/projects/${projectId}/designs`)
    }

    return { success: true, message: "Design deleted successfully" }
  } catch (error) {
    console.error("Error deleting design:", error)
    return { success: false, message: "An error occurred while deleting the design" }
  }
}

// New function to save design from onboarding flow
export async function saveDesignFromOnboarding(
  design: WebsiteDesign,
  onboardingData: OnboardingData,
  projectId?: number,
) {
  try {
    const designData = {
      project_id: projectId,
      company_name: onboardingData.company.companyName,
      design_name: design.name,
      description: design.description,
      color_palette: design.colorPalette,
      typography: design.typography,
      layout: design.layout,
      features: design.features,
      image_style: design.imageStyle,
      preview_images: {
        desktop: design.previewImage,
        mobile: design.mobilePreviewImage,
        tablet: design.tabletPreviewImage,
      },
    }

    const result = await saveDesign(designData)

    if (!result.success) {
      return { success: false, message: "Failed to save design" }
    }

    if (projectId) {
      revalidatePath(`/dashboard/projects/${projectId}`)
      revalidatePath(`/dashboard/projects/${projectId}/designs`)
    }

    return { success: true, message: "Design saved successfully", designId: result.design.id }
  } catch (error) {
    console.error("Error saving design from onboarding:", error)
    return { success: false, message: "An error occurred while saving the design" }
  }
}

