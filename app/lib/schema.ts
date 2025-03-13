import { z } from "zod"

// Company Information Schema
export const companyInfoSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  industry: z.string(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  logo: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
})

// Service Information Schema
export const serviceInfoSchema = z.object({
  targetAudience: z.string().min(5, {
    message: "Please describe your target audience.",
  }),
  mainServices: z.array(z.string()).min(1, {
    message: "Please add at least one service or product.",
  }),
  uniqueSellingPoints: z.string().min(10, {
    message: "Please describe what makes your business unique.",
  }),
  hasPhysicalLocation: z.boolean().default(false),
  locationDetails: z.string().optional(),
})

// Design Preferences Schema
export const designPreferencesSchema = z.object({
  stylePreference: z.enum(["minimal", "bold", "professional", "creative", "luxury"]),
  colorScheme: z.enum(["neutral", "warm", "cool", "bright", "dark", "yellowBlack"]),
  complexity: z.number().min(1).max(5),
  mustHaveFeatures: z.array(z.string()),
  additionalNotes: z.string().optional(),
})

// Combined Onboarding Data Schema
export const onboardingDataSchema = z.object({
  company: companyInfoSchema,
  services: serviceInfoSchema,
  designPreferences: designPreferencesSchema,
})

// Website Design Schema (output from AI)
export const websiteDesignSchema = z.object({
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

// Array of Website Designs
export const websiteDesignsSchema = z.array(websiteDesignSchema)

// Website Code Schema (output from AI)
export const websiteCodeSchema = z.object({
  html: z.string(),
  css: z.string(),
  javascript: z.string().optional(),
  nextjs: z
    .object({
      pages: z.array(
        z.object({
          name: z.string(),
          code: z.string(),
        }),
      ),
      components: z.array(
        z.object({
          name: z.string(),
          code: z.string(),
        }),
      ),
      styles: z.array(
        z.object({
          name: z.string(),
          code: z.string(),
        }),
      ),
    })
    .optional(),
})

// Types derived from schemas
export type CompanyInfo = z.infer<typeof companyInfoSchema>
export type ServiceInfo = z.infer<typeof serviceInfoSchema>
export type DesignPreferences = z.infer<typeof designPreferencesSchema>
export type OnboardingData = z.infer<typeof onboardingDataSchema>
export type WebsiteDesign = z.infer<typeof websiteDesignSchema>
export type WebsiteDesigns = z.infer<typeof websiteDesignsSchema>
export type WebsiteCode = z.infer<typeof websiteCodeSchema>

