"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getDesignById } from "@/app/lib/design-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Code } from "lucide-react"
import Link from "next/link"
import { generateWebsiteCode } from "@/app/lib/ai-code-generator"
import CodeDisplay from "@/app/onboarding/code-display"
import type { WebsiteCode, WebsiteDesign } from "@/app/lib/schema"

export default function DesignCodePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [design, setDesign] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<WebsiteCode | null>(null)
  const [codeError, setCodeError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const result = await getDesignById(params.id)
        if (result.success) {
          setDesign(result.design)
        } else {
          setError("Failed to load design")
        }
      } catch (err) {
        setError("An error occurred while fetching the design")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDesign()
  }, [params.id])

  const handleGenerateCode = async () => {
    if (!design) return

    setIsGeneratingCode(true)
    setCodeError(null)

    try {
      // Convert the database design to the WebsiteDesign format
      const designData: WebsiteDesign = {
        id: design.id,
        name: design.design_name,
        description: design.description,
        colorPalette:
          typeof design.color_palette === "string" ? JSON.parse(design.color_palette) : design.color_palette,
        typography: typeof design.typography === "string" ? JSON.parse(design.typography) : design.typography,
        layout: typeof design.layout === "string" ? JSON.parse(design.layout) : design.layout,
        features: typeof design.features === "string" ? JSON.parse(design.features) : design.features,
        imageStyle: design.image_style,
        previewImage:
          typeof design.preview_images === "string"
            ? JSON.parse(design.preview_images).desktop
            : design.preview_images?.desktop,
        mobilePreviewImage:
          typeof design.preview_images === "string"
            ? JSON.parse(design.preview_images).mobile
            : design.preview_images?.mobile,
        tabletPreviewImage:
          typeof design.preview_images === "string"
            ? JSON.parse(design.preview_images).tablet
            : design.preview_images?.tablet,
      }

      const code = await generateWebsiteCode(designData)
      setGeneratedCode(code)
    } catch (error) {
      console.error("Error generating code:", error)
      setCodeError("There was an error generating the code. Please try again later.")
    } finally {
      setIsGeneratingCode(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">Loading design details...</div>
      </div>
    )
  }

  if (error || !design) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error || "Design not found"}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" asChild>
          <Link href={`/dashboard/designs/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Design
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Generate Code for {design.design_name}</h1>
        <p className="text-gray-500">Created for {design.company_name}</p>
      </div>

      {!generatedCode && !isGeneratingCode && (
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <Code className="h-16 w-16 mx-auto mb-4 text-beehive-yellow" />
            <h2 className="text-2xl font-bold mb-2">Ready to Generate Code?</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We'll use AI to generate the complete code for your website design. This includes HTML, CSS, JavaScript,
              and Next.js components.
            </p>
            <Button
              onClick={handleGenerateCode}
              className="bg-beehive-yellow text-beehive-black hover:bg-beehive-hover"
              size="lg"
            >
              <Code className="mr-2 h-5 w-5" /> Generate Code
            </Button>
          </CardContent>
        </Card>
      )}

      {isGeneratingCode && (
        <div className="mt-6 text-center">
          <div className="mb-4 text-lg font-medium">Generating website code with Claude AI...</div>
          <div className="mx-auto h-2 w-full max-w-md animate-pulse rounded-full bg-beehive-light"></div>
          <p className="mt-2 text-sm text-gray-500">
            This may take a moment as our AI creates the code for your website.
          </p>
        </div>
      )}

      {codeError && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-red-500">
          <p>{codeError}</p>
        </div>
      )}

      {generatedCode && <CodeDisplay code={generatedCode} />}
    </div>
  )
}

