import { sql } from "./db"
import type { WebsiteCode } from "./schema"

export async function saveWebsiteCode(designId: string, code: WebsiteCode) {
  try {
    console.log("Saving code for design ID:", designId)
    console.log(
      "Code object structure:",
      JSON.stringify(
        {
          html: typeof code.html,
          css: typeof code.css,
          javascript: typeof code.javascript,
          nextjs: code.nextjs
            ? {
                pages: Array.isArray(code.nextjs.pages) ? code.nextjs.pages.length : "not array",
                components: Array.isArray(code.nextjs.components) ? code.nextjs.components.length : "not array",
                styles: Array.isArray(code.nextjs.styles) ? code.nextjs.styles.length : "not array",
              }
            : "undefined",
        },
        null,
        2,
      ),
    )

    // Check if code already exists for this design
    const existingCode = await sql`
      SELECT id FROM website_code WHERE design_id = ${designId}
    `

    // Format the nextjs components, pages, and styles as JSON
    const nextjsComponents = code.nextjs
      ? {
          pages: code.nextjs.pages || [],
          components: code.nextjs.components || [],
          styles: code.nextjs.styles || [],
        }
      : null

    console.log(
      "Formatted nextjs_components structure:",
      nextjsComponents
        ? `Object with ${nextjsComponents.pages.length} pages, ${nextjsComponents.components.length} components, ${nextjsComponents.styles.length} styles`
        : "null",
    )

    if (existingCode.length > 0) {
      console.log("Updating existing code record:", existingCode[0].id)
      // Update existing code
      await sql`
        UPDATE website_code
        SET 
          html = ${code.html || ""},
          css = ${code.css || ""},
          javascript = ${code.javascript || null},
          nextjs_components = ${nextjsComponents ? JSON.stringify(nextjsComponents) : null}
        WHERE design_id = ${designId}
      `
      return { success: true, codeId: existingCode[0].id }
    } else {
      console.log("Inserting new code record")
      // Insert new code
      const result = await sql`
        INSERT INTO website_code (
          design_id,
          html,
          css,
          javascript,
          nextjs_components
        ) VALUES (
          ${designId},
          ${code.html || ""},
          ${code.css || ""},
          ${code.javascript || null},
          ${nextjsComponents ? JSON.stringify(nextjsComponents) : null}
        )
        RETURNING id
      `
      console.log("New code record created with ID:", result[0]?.id)
      return { success: true, codeId: result[0]?.id }
    }
  } catch (error) {
    console.error("Error saving website code:", error)
    return { success: false, error }
  }
}

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

export async function listWebsiteCode() {
  try {
    console.log("Listing all website code entries")
    const codes = await sql`
      SELECT 
        wc.id, 
        wc.design_id, 
        wc.html,
        wc.css,
        wc.javascript,
        wc.nextjs_components,
        wc.created_at, 
        d.design_name, 
        d.company_name
      FROM 
        website_code wc
      JOIN 
        designs d ON wc.design_id = d.id
      ORDER BY 
        wc.created_at DESC
    `

    console.log(`Found ${codes.length} code entries`)
    return { success: true, codes }
  } catch (error) {
    console.error("Error listing website code:", error)
    return { success: false, error }
  }
}

export async function deleteWebsiteCode(id: string) {
  try {
    // Check if the ID is a design ID or a code ID
    const isDesignId = await sql`
      SELECT COUNT(*) as count FROM designs WHERE id = ${id}
    `

    if (isDesignId[0].count > 0) {
      console.log("Deleting code for design ID:", id)
      await sql`
        DELETE FROM website_code WHERE design_id = ${id}
      `
    } else {
      console.log("Deleting code with ID:", id)
      await sql`
        DELETE FROM website_code WHERE id = ${id}
      `
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting website code:", error)
    return { success: false, error }
  }
}

export async function getAllCodeVersionsForDesign(designId: string) {
  try {
    console.log("Fetching all code versions for design ID:", designId)
    const codeVersions = await sql`
      SELECT 
        id, 
        created_at,
        (nextjs_components IS NOT NULL AND nextjs_components != 'null') as has_nextjs
      FROM 
        website_code 
      WHERE 
        design_id = ${designId}
      ORDER BY 
        created_at DESC
    `

    console.log(`Found ${codeVersions.length} code versions for design ID: ${designId}`)
    return { success: true, codeVersions }
  } catch (error) {
    console.error("Error fetching code versions:", error)
    return { success: false, error }
  }
}

