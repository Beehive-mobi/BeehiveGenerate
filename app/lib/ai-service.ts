"use server"

import { generateObject } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"
import type { OnboardingData, WebsiteDesigns } from "./schema"

export async function generateWebsiteDesigns(data: OnboardingData): Promise<WebsiteDesigns> {
  try {
    // For demo purposes, we'll use a simulated response if no Anthropic API key is available
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log("No Anthropic API key found, using simulated response")
      return simulateDesigns(data)
    }

    const prompt = `
    Generate 3 unique website designs based on the following information:
    
    Company Information:
    - Name: ${data.company.companyName}
    - Industry: ${data.company.industry}
    - Description: ${data.company.description}
    
    Target Audience and Services:
    - Target Audience: ${data.services.targetAudience}
    - Main Services/Products: ${data.services.mainServices.join(", ")}
    - Unique Selling Points: ${data.services.uniqueSellingPoints}
    - Has Physical Location: ${data.services.hasPhysicalLocation}
    ${data.services.hasPhysicalLocation ? `- Location Details: ${data.services.locationDetails}` : ""}
    
    Design Preferences:
    - Style Preference: ${data.designPreferences.stylePreference}
    - Color Scheme: ${data.designPreferences.colorScheme}
    - Complexity (1-5): ${data.designPreferences.complexity}
    - Must-Have Features: ${data.designPreferences.mustHaveFeatures.join(", ")}
    ${data.designPreferences.additionalNotes ? `- Additional Notes: ${data.designPreferences.additionalNotes}` : ""}
    
    Generate 3 distinct website design concepts that would work well for this business.
    Each design should have a unique name, description, color palette, typography, layout, and feature set.
    For the preview images, use placeholder URLs.
    
    Make sure the designs are creative, professional, and aligned with the company's brand identity and target audience.
    Consider the industry and unique selling points when creating the designs.
  `

    // Define the schema for a single website design
    const websiteDesignSchema = z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      colorPalette: z.object({
        primary: z.string(),
        secondary: z.string(),
        accent: z.string(),
        background: z.string(),
        text: z.string(),
      }),
      typography: z.object({
        headingFont: z.string(),
        bodyFont: z.string(),
      }),
      layout: z.object({
        type: z.string(),
        sections: z.array(z.string()),
      }),
      features: z.array(z.string()),
      imageStyle: z.string(),
      previewImage: z.string(),
      mobilePreviewImage: z.string(),
      tabletPreviewImage: z.string(),
    })

    // Define the schema for the array of website designs
    const responseSchema = z.object({
      designs: z.array(websiteDesignSchema),
    })

    const result = await generateObject({
      model: anthropic("claude-3-opus-20240229"),
      schema: responseSchema,
      prompt,
    })

    console.log('result: ', result.object.designs)

    return result.object.designs
  } catch (error) {
    console.error("Error generating website designs:", error)
    return simulateDesigns(data)
  }
}

// Fallback function to simulate designs when API is not available
function simulateDesigns(data: OnboardingData): WebsiteDesigns {
  const colorSchemeMap = {
    neutral: { primary: "#4A4A4A", secondary: "#7A7A7A", accent: "#DADADA" },
    warm: { primary: "#E57C23", secondary: "#E8AA42", accent: "#F8F1F1" },
    cool: { primary: "#146C94", secondary: "#19A7CE", accent: "#E5F9DB" },
    bright: { primary: "#1B9C85", secondary: "#E8F6EF", accent: "#FFD966" },
    dark: { primary: "#2C3333", secondary: "#395B64", accent: "#A5C9CA" },
    yellowBlack: { primary: "#FFD100", secondary: "#1A1A1A", accent: "#FFF8E1" },
  }

  const selectedColors =
    colorSchemeMap[data.designPreferences.colorScheme as keyof typeof colorSchemeMap] || colorSchemeMap.yellowBlack

  return [
    {
      id: 1,
      name: `Modern ${data.designPreferences.stylePreference.charAt(0).toUpperCase() + data.designPreferences.stylePreference.slice(1)}`,
      description: `A clean, modern design that showcases ${data.company.companyName}'s brand identity with a focus on user experience.`,
      colorPalette: {
        primary: selectedColors.primary,
        secondary: selectedColors.secondary,
        accent: selectedColors.accent,
        background: "#FFFFFF",
        text: "#333333",
      },
      typography: {
        headingFont: "Montserrat",
        bodyFont: "Open Sans",
      },
      layout: {
        type: "Single Page",
        sections: ["Hero", "About", "Services", "Testimonials", "Contact"],
      },
      features: data.designPreferences.mustHaveFeatures,
      imageStyle: "Minimalist",
      previewImage: "/placeholder.svg?height=400&width=600&text=Desktop+Preview",
      mobilePreviewImage: "/placeholder.svg?height=600&width=300&text=Mobile+Preview",
      tabletPreviewImage: "/placeholder.svg?height=500&width=400&text=Tablet+Preview",
    },
    {
      id: 2,
      name: `Bold ${data.company.industry.charAt(0).toUpperCase() + data.company.industry.slice(1)}`,
      description: `A striking design with bold typography and imagery that makes ${data.company.companyName} stand out from competitors.`,
      colorPalette: {
        primary: selectedColors.secondary,
        secondary: selectedColors.primary,
        accent: selectedColors.accent,
        background: "#F9F9F9",
        text: "#222222",
      },
      typography: {
        headingFont: "Playfair Display",
        bodyFont: "Roboto",
      },
      layout: {
        type: "Multi Page",
        sections: ["Home", "About", "Services", "Portfolio", "Blog", "Contact"],
      },
      features: [...data.designPreferences.mustHaveFeatures, "Animation"],
      imageStyle: "Bold Photography",
      previewImage: "/placeholder.svg?height=400&width=600&text=Desktop+Preview",
      mobilePreviewImage: "/placeholder.svg?height=600&width=300&text=Mobile+Preview",
      tabletPreviewImage: "/placeholder.svg?height=500&width=400&text=Tablet+Preview",
    },
    {
      id: 3,
      name: `${data.designPreferences.stylePreference.charAt(0).toUpperCase() + data.designPreferences.stylePreference.slice(1)} Professional`,
      description: `A professional design that conveys trust and expertise, perfect for ${data.company.companyName}'s target audience.`,
      colorPalette: {
        primary: selectedColors.accent,
        secondary: selectedColors.primary,
        accent: selectedColors.secondary,
        background: "#FFFFFF",
        text: "#444444",
      },
      typography: {
        headingFont: "Merriweather",
        bodyFont: "Source Sans Pro",
      },
      layout: {
        type: "Hybrid",
        sections: ["Hero", "Features", "Testimonials", "Team", "FAQ", "Contact"],
      },
      features: [...data.designPreferences.mustHaveFeatures, "Custom Icons"],
      imageStyle: "Professional",
      previewImage: "/placeholder.svg?height=400&width=600&text=Desktop+Preview",
      mobilePreviewImage: "/placeholder.svg?height=600&width=300&text=Mobile+Preview",
      tabletPreviewImage: "/placeholder.svg?height=500&width=400&text=Tablet+Preview",
    },
  ]
}

