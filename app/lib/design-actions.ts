import { sql } from "./db"
import type { WebsiteDesign, OnboardingData } from "./schema"

export async function saveDesign(design: WebsiteDesign, onboardingData: OnboardingData) {
  try {
    const result = await sql`
      INSERT INTO designs (
        user_id,
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

export async function getDesigns() {
  try {
    const designs = await sql`
      SELECT * FROM designs
    `
    return { success: true, designs }
  } catch (error) {
    console.error("Error fetching designs:", error)
    return { success: false, error }
  }
}

export async function getDesignById(id: string) {
  try {
    const design = await sql`
      SELECT * FROM designs WHERE id = ${id}
    `
    if (design.length === 0) {
      return { success: false, error: "Design not found" }
    }
    return { success: true, design: design[0] }
  } catch (error) {
    console.error("Error fetching design:", error)
    return { success: false, error }
  }
}

export async function deleteDesign(id: string) {
  try {
    await sql`
      DELETE FROM designs WHERE id = ${id}
    `
    return { success: true }
  } catch (error) {
    console.error("Error deleting design:", error)
    return { success: false, error }
  }
}

