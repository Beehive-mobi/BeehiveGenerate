// import { sql } from "./db"
// import type { WebsiteCode } from "./schema"

// export async function saveWebsiteCode(designId: string, code: WebsiteCode) {
//   try {
//     console.log("Saving code for design ID:", designId)
//     console.log(
//       "Code object structure:",
//       JSON.stringify(
//         {
//           html: typeof code.html,
//           css: typeof code.css,
//           javascript: typeof code.javascript,
//           nextjs: code.nextjs
//             ? {
//                 pages: Array.isArray(code.nextjs.pages) ? code.nextjs.pages.length : "not array",
//                 components: Array.isArray(code.nextjs.components) ? code.nextjs.components.length : "not array",
//                 styles: Array.isArray(code.nextjs.styles) ? code.nextjs.styles.length : "not array",
//               }
//             : "undefined",
//         },
//         null,
//         2,
//       ),
//     )

//     // Check if code already exists for this design
//     const existingCode = await sql`
//       SELECT id FROM website_code WHERE design_id = ${designId}
//     `

//     // Format the nextjs components, pages, and styles as JSON
//     const nextjsComponents = code.nextjs
//       ? {
//           pages: code.nextjs.pages || [],
//           components: code.nextjs.components || [],
//           styles: code.nextjs.styles || [],
//         }
//       : null

//     console.log(
//       "Formatted nextjs_components structure:",
//       nextjsComponents
//         ? `Object with ${nextjsComponents.pages.length} pages, ${nextjsComponents.components.length} components, ${nextjsComponents.styles.length} styles`
//         : "null",
//     )

//     if (existingCode.length > 0) {
//       console.log("Updating existing code record:", existingCode[0].id)
//       // Update existing code
//       await sql`
//         UPDATE website_code
//         SET 
//           html = ${code.html || ""},
//           css = ${code.css || ""},
//           javascript = ${code.javascript || null},
//           nextjs_components = ${nextjsComponents ? JSON.stringify(nextjsComponents) : null}
//         WHERE design_id = ${designId}
//       `
//       return { success: true, codeId: existingCode[0].id }
//     } else {
//       console.log("Inserting new code record")
//       // Insert new code
//       const result = await sql`
//         INSERT INTO website_code (
//           design_id,
//           html,
//           css,
//           javascript,
//           nextjs_components
//         ) VALUES (
//           ${designId},
//           ${code.html || ""},
//           ${code.css || ""},
//           ${code.javascript || null},
//           ${nextjsComponents ? JSON.stringify(nextjsComponents) : null}
//         )
//         RETURNING id
//       `
//       console.log("New code record created with ID:", result[0]?.id)
//       return { success: true, codeId: result[0]?.id }
//     }
//   } catch (error) {
//     console.error("Error saving website code:", error)
//     return { success: false, error }
//   }
// }

// export async function getWebsiteCodeByDesignId(designId: string) {
//   try {
//     console.log("Fetching code for design ID:", designId)
//     const codeResult = await sql`
//       SELECT * FROM website_code WHERE design_id = ${designId}
//     `

//     if (codeResult.length === 0) {
//       console.log("No code found for design ID:", designId)
//       return { success: false, error: "Website code not found" }
//     }

//     const code = codeResult[0]
//     console.log("Code found with ID:", code.id)

//     // Parse nextjs_components if it's a string
//     let nextjsComponents = null
//     if (code.nextjs_components) {
//       try {
//         nextjsComponents =
//           typeof code.nextjs_components === "string" ? JSON.parse(code.nextjs_components) : code.nextjs_components
//         console.log("Successfully parsed nextjs_components")
//       } catch (e) {
//         console.error("Error parsing nextjs_components:", e)
//         nextjsComponents = { pages: [], components: [], styles: [] }
//       }
//     }

//     // Convert the database format back to the WebsiteCode format
//     const websiteCode: WebsiteCode = {
//       html: code.html || "",
//       css: code.css || "",
//       javascript: code.javascript || undefined,
//       nextjs: nextjsComponents || {
//         pages: [],
//         components: [],
//         styles: [],
//       },
//     }

//     console.log(
//       "Returning website code with structure:",
//       JSON.stringify(
//         {
//           html: typeof websiteCode.html,
//           css: typeof websiteCode.css,
//           javascript: typeof websiteCode.javascript,
//           nextjs: websiteCode.nextjs
//             ? {
//                 pages: Array.isArray(websiteCode.nextjs.pages) ? websiteCode.nextjs.pages.length : "not array",
//                 components: Array.isArray(websiteCode.nextjs.components)
//                   ? websiteCode.nextjs.components.length
//                   : "not array",
//                 styles: Array.isArray(websiteCode.nextjs.styles) ? websiteCode.nextjs.styles.length : "not array",
//               }
//             : "undefined",
//         },
//         null,
//         2,
//       ),
//     )

//     return { success: true, code: websiteCode }
//   } catch (error) {
//     console.error("Error fetching website code:", error)
//     return { success: false, error }
//   }
// }

// export async function listWebsiteCode() {
//   try {
//     console.log("Listing all website code entries")
//     const codes = await sql`
//       SELECT 
//         wc.id, 
//         wc.design_id, 
//         wc.html,
//         wc.css,
//         wc.javascript,
//         wc.nextjs_components,
//         wc.created_at, 
//         d.design_name, 
//         d.company_name
//       FROM 
//         website_code wc
//       JOIN 
//         designs d ON wc.design_id = d.id
//       ORDER BY 
//         wc.created_at DESC
//     `

//     console.log(`Found ${codes.length} code entries`)
//     return { success: true, codes }
//   } catch (error) {
//     console.error("Error listing website code:", error)
//     return { success: false, error }
//   }
// }

// export async function deleteWebsiteCode(id: string) {
//   try {
//     // Check if the ID is a design ID or a code ID
//     const isDesignId = await sql`
//       SELECT COUNT(*) as count FROM designs WHERE id = ${id}
//     `

//     if (isDesignId[0].count > 0) {
//       console.log("Deleting code for design ID:", id)
//       await sql`
//         DELETE FROM website_code WHERE design_id = ${id}
//       `
//     } else {
//       console.log("Deleting code with ID:", id)
//       await sql`
//         DELETE FROM website_code WHERE id = ${id}
//       `
//     }

//     return { success: true }
//   } catch (error) {
//     console.error("Error deleting website code:", error)
//     return { success: false, error }
//   }
// }

// export async function getAllCodeVersionsForDesign(designId: string) {
//   try {
//     console.log("Fetching all code versions for design ID:", designId)
//     const codeVersions = await sql`
//       SELECT 
//         id, 
//         created_at,
//         (nextjs_components IS NOT NULL AND nextjs_components != 'null') as has_nextjs
//       FROM 
//         website_code 
//       WHERE 
//         design_id = ${designId}
//       ORDER BY 
//         created_at DESC
//     `

//     console.log(`Found ${codeVersions.length} code versions for design ID: ${designId}`)
//     return { success: true, codeVersions }
//   } catch (error) {
//     console.error("Error fetching code versions:", error)
//     return { success: false, error }
//   }
// }

"use server"
import { sql } from "./db"
import { revalidatePath } from "next/cache"
import { getCodeByProject, getCodeByDesign, getCodeById, saveCode, deleteCode, getDesignById } from "@/app/lib/db"
import type { WebsiteCode } from "@/app/lib/schema"


export async function getWebsiteCodeByDesignId(designId: string) {
  try {
    console.log("Fetching code for design ID:", designId)
    const codeResult = await sql`
      SELECT * FROM website_code WHERE design_id = ${designId}
    `

    if (codeResult.length === 0) {
      console.log("No code found for design ID:", designId)
      return { success: false, error: "Website code not found" }
    }

    const code = codeResult[0]
    console.log("Code found with ID:", code.id)

    // Parse nextjs_components if it's a string
    let nextjsComponents = null
    if (code.nextjs_components) {
      try {
        nextjsComponents =
          typeof code.nextjs_components === "string" ? JSON.parse(code.nextjs_components) : code.nextjs_components
        console.log("Successfully parsed nextjs_components")
      } catch (e) {
        console.error("Error parsing nextjs_components:", e)
        nextjsComponents = { pages: [], components: [], styles: [] }
      }
    }

    // Convert the database format back to the WebsiteCode format
    const websiteCode: WebsiteCode = {
      html: code.html || "",
      css: code.css || "",
      javascript: code.javascript || undefined,
      nextjs: nextjsComponents || {
        pages: [],
        components: [],
        styles: [],
      },
    }

    console.log(
      "Returning website code with structure:",
      JSON.stringify(
        {
          html: typeof websiteCode.html,
          css: typeof websiteCode.css,
          javascript: typeof websiteCode.javascript,
          nextjs: websiteCode.nextjs
            ? {
                pages: Array.isArray(websiteCode.nextjs.pages) ? websiteCode.nextjs.pages.length : "not array",
                components: Array.isArray(websiteCode.nextjs.components)
                  ? websiteCode.nextjs.components.length
                  : "not array",
                styles: Array.isArray(websiteCode.nextjs.styles) ? websiteCode.nextjs.styles.length : "not array",
              }
            : "undefined",
        },
        null,
        2,
      ),
    )

    return { success: true, code: websiteCode }
  } catch (error) {
    console.error("Error fetching website code:", error)
    return { success: false, error }
  }
}


export async function fetchCodeByProject(projectId: number) {
  try {
    const result = await getCodeByProject(projectId)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to fetch code" }
    }

    return { success: true, code: result.code }
  } catch (error) {
    console.error("Error fetching code:", error)
    return { success: false, message: "An error occurred while fetching code" }
  }
}

export async function fetchCodeByDesign(designId: number) {
  try {
    const result = await getCodeByDesign(designId)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to fetch code" }
    }

    return { success: true, code: result.code }
  } catch (error) {
    console.error("Error fetching code:", error)
    return { success: false, message: "An error occurred while fetching code" }
  }
}

export async function fetchCodeDetails(id: number) {
  try {
    const result = await getCodeById(id)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to fetch code" }
    }

    return { success: true, code: result.code }
  } catch (error) {
    console.error("Error fetching code details:", error)
    return { success: false, message: "An error occurred while fetching code details" }
  }
}

export async function createOrUpdateCode(formData: FormData) {
  try {
    const id = formData.get("id") ? Number(formData.get("id")) : undefined
    const designId = Number(formData.get("design_id"))
    const projectId = formData.get("project_id") ? Number(formData.get("project_id")) : undefined
    const html = formData.get("html") as string
    const css = formData.get("css") as string
    const javascript = formData.get("javascript") as string

    if (!designId) {
      return { success: false, message: "Design ID is required" }
    }

    // Get project_id from design if not provided
    if (!projectId) {
      const designResult = await getDesignById(designId)
      if (designResult.success && designResult.design.project_id) {
        const project_id = designResult.design.project_id
        const projectId = project_id
      }
    }

    const codeData = {
      id,
      design_id: designId,
      project_id: projectId,
      html: html || undefined,
      css: css || undefined,
      javascript: javascript || undefined,
    }

    const result = await saveCode(codeData)

    if (!result.success) {
      return { success: false, message: "Failed to save code" }
    }

    revalidatePath("/dashboard/projects")
    if (projectId) {
      revalidatePath(`/dashboard/projects/${projectId}`)
      revalidatePath(`/dashboard/projects/${projectId}/code`)
    }

    return { success: true, message: "Code saved successfully", code: result.code }
  } catch (error) {
    console.error("Error saving code:", error)
    return { success: false, message: "An error occurred while saving the code" }
  }
}

export async function removeCode(id: number) {
  try {
    const codeResult = await getCodeById(id)

    if (!codeResult.success) {
      return { success: false, message: "Code not found" }
    }

    const projectId = codeResult.code.project_id

    const result = await deleteCode(id)

    if (!result.success) {
      return { success: false, message: result.message || "Failed to delete code" }
    }

    revalidatePath("/dashboard/projects")
    if (projectId) {
      revalidatePath(`/dashboard/projects/${projectId}`)
      revalidatePath(`/dashboard/projects/${projectId}/code`)
    }

    return { success: true, message: "Code deleted successfully" }
  } catch (error) {
    console.error("Error deleting code:", error)
    return { success: false, message: "An error occurred while deleting the code" }
  }
}

// New function to save website code from the provided format
export async function saveWebsiteCodeFromFormat(designId: number, code: WebsiteCode, projectId?: number) {
  try {
    console.log("Saving code for design ID:", designId)

    // Format the nextjs components, pages, and styles as JSON
    const nextjsComponents = code.nextjs
      ? {
          pages: code.nextjs.pages || [],
          components: code.nextjs.components || [],
          styles: code.nextjs.styles || [],
        }
      : null

    // Get project_id from design if not provided
    if (!projectId) {
      const designResult = await getDesignById(designId)
      if (designResult.success && designResult.design.project_id) {
        projectId = designResult.design.project_id
      }
    }

    const codeData = {
      design_id: designId,
      project_id: projectId,
      html: code.html || undefined,
      css: code.css || undefined,
      javascript: code.javascript || undefined,
      nextjs_components: nextjsComponents,
    }

    const result = await saveCode(codeData)

    if (!result.success) {
      return { success: false, message: "Failed to save code" }
    }

    if (projectId) {
      revalidatePath(`/dashboard/projects/${projectId}`)
      revalidatePath(`/dashboard/projects/${projectId}/code`)
    }

    return { success: true, message: "Code saved successfully", codeId: result.code.id }
  } catch (error) {
    console.error("Error saving website code:", error)
    return { success: false, message: "An error occurred while saving the code" }
  }
}

// New function to get website code in the expected format
export async function getWebsiteCodeInFormat(codeId: number) {
  try {
    const result = await getCodeById(codeId)

    if (!result.success) {
      return { success: false, message: "Code not found" }
    }

    const code = result.code

    // Convert the database format to the WebsiteCode format
    const websiteCode: WebsiteCode = {
      html: code.html || "",
      css: code.css || "",
      javascript: code.javascript || undefined,
      nextjs: code.nextjs_components
        ? {
            pages: code.nextjs_components.pages || [],
            components: code.nextjs_components.components || [],
            styles: code.nextjs_components.styles || [],
          }
        : {
            pages: [],
            components: [],
            styles: [],
          },
    }

    return { success: true, code: websiteCode }
  } catch (error) {
    console.error("Error fetching website code:", error)
    return { success: false, message: "An error occurred while fetching the code" }
  }
}

// New function to get all code versions for a design
export async function getAllCodeVersionsForDesign(designId: number) {
  try {
    const result = await getCodeByDesign(designId)

    if (!result.success) {
      return { success: false, message: "Failed to fetch code versions" }
    }

    const codeVersions = result.code.map((code) => ({
      id: code.id,
      created_at: code.created_at,
      has_nextjs: code.nextjs_components !== null && code.nextjs_components !== undefined,
    }))

    return { success: true, codeVersions }
  } catch (error) {
    console.error("Error fetching code versions:", error)
    return { success: false, message: "An error occurred while fetching code versions" }
  }
}

