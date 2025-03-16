"use server"

import { sql } from "./db"
import type { WebsiteDesign, OnboardingData } from "./schema"

export async function saveDesign(design: WebsiteDesign, onboardingData: OnboardingData) {
  try {
    // Extract the data we want to save
    const {
      id,
      name,
      description,
      colorPalette,
      typography,
      layout,
      features,
      imageStyle,
      previewImage,
      mobilePreviewImage,
      tabletPreviewImage,
    } = design

    // Insert the design into the database
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
        ${"user-" + Math.floor(Math.random() * 10000)}, /* Replace with actual user ID in production */
        ${onboardingData.company.companyName},
        ${name},
        ${description},
        ${JSON.stringify(colorPalette)},
        ${JSON.stringify(typography)},
        ${JSON.stringify(layout)},
        ${JSON.stringify(features)},
        ${imageStyle},
        ${JSON.stringify({
          desktop: previewImage,
          mobile: mobilePreviewImage,
          tablet: tabletPreviewImage,
        })}
      ) RETURNING id
    `

    console.log("Design saved successfully:", result)
    return { success: true, designId: result[0]?.id }
  } catch (error) {
    console.error("Error saving design:", error)
    return { success: false, error }
  }
}

export async function getDesigns(userId?: string) {
  try {
    let designs

    if (userId) {
      designs = await sql`
        SELECT * FROM designs 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `
    } else {
      designs = await sql`
        SELECT * FROM designs 
        ORDER BY created_at DESC
        LIMIT 10
      `
    }

    return { success: true, designs }
  } catch (error) {
    console.error("Error fetching designs:", error)
    return { success: false, error }
  }
}

export async function getDesignById(id: string | number) {
  try {
    const design = await sql`
      SELECT * FROM designs 
      WHERE id = ${id}
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

export async function deleteDesign(id: string | number) {
  try {
    await sql`
      DELETE FROM designs 
      WHERE id = ${id}
    `

    return { success: true }
  } catch (error) {
    console.error("Error deleting design:", error)
    return { success: false, error }
  }
}

