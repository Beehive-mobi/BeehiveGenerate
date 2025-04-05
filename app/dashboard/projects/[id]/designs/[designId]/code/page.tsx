"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
//import { getDesignById } from "@/app/lib/design-actions"
import { fetchDesignDetails } from "@/app/lib/design-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Code, Save, Trash } from "lucide-react"
import Link from "next/link"
import { generateWebsiteCode } from "@/app/lib/ai-code-generator"
import { saveWebsiteCode, getWebsiteCodeByDesignId, deleteWebsiteCode, saveWebsiteCodeFromFormat, removeCode } from "@/app/lib/code-actions"
import CodeDisplay from "@/app/dashboard/projects/[id]/generate-design/code-display"
import type { WebsiteCode, WebsiteDesign } from "@/app/lib/schema"
import { toast } from "@/hooks/use-toast"

interface PageProps {
  params: {
    id: string
  }
}

export default function DesignCodePage({ params }: PageProps) {
  const router = useRouter()
  const { designId, id } = React.use(params)
  const [design, setDesign] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [isSavingCode, setIsSavingCode] = useState(false)
  const [isDeletingCode, setIsDeletingCode] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<WebsiteCode | null>(null)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [savedCodeExists, setSavedCodeExists] = useState(false)

  useEffect(() => {
    const fetchDesign = async () => {
      if (!designId) return

      try {
        const result = await fetchDesignDetails(designId)
        if (result.success) {
          setDesign(result.design)

          // Check if code already exists for this design
          const codeResult = await getWebsiteCodeByDesignId(designId)
          if (codeResult.success) {
            console.log("Found existing code for design:", designId)
            setGeneratedCode(codeResult.code)
            setSavedCodeExists(true)
          } else {
            console.log("No existing code found for design:", designId)
          }
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
  }, [designId])

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

      console.log("Generating code for design:", designData.name)
      const code = await generateWebsiteCode(designData)
      console.log("Code generated successfully")
      setGeneratedCode(code)

      // Explicitly save the generated code
      console.log("Saving generated code...")
      await handleSaveCode(code)
    } catch (error) {
      console.error("Error generating code:", error)
      setCodeError("There was an error generating the code. Please try again later.")
    } finally {
      setIsGeneratingCode(false)
    }
  }

  const handleSaveCode = async (codeToSave: WebsiteCode = generatedCode!) => {
    if (!codeToSave || !designId) return

    setIsSavingCode(true)

    try {
      console.log("Saving code for design:", designId)
      console.log(
        "Code to save structure:",
        JSON.stringify(
          {
            html: typeof codeToSave.html,
            css: typeof codeToSave.css,
            javascript: typeof codeToSave.javascript,
            nextjs: codeToSave.nextjs
              ? {
                  pages: Array.isArray(codeToSave.nextjs.pages) ? codeToSave.nextjs.pages.length : "not array",
                  components: Array.isArray(codeToSave.nextjs.components)
                    ? codeToSave.nextjs.components.length
                    : "not array",
                  styles: Array.isArray(codeToSave.nextjs.styles) ? codeToSave.nextjs.styles.length : "not array",
                }
              : "undefined",
          },
          null,
          2,
        ),
      )

      const result = await saveWebsiteCodeFromFormat(designId, codeToSave, id)

      if (result.success) {
        console.log("Code saved successfully with ID:", result.codeId)
        toast({
          title: "Code saved",
          description: "Your website code has been saved successfully.",
        })
        setSavedCodeExists(true)
      } else {
        console.error("Failed to save code:", result.error)
        toast({
          title: "Error saving code",
          description: "There was an error saving your code. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving code:", error)
      toast({
        title: "Error saving code",
        description: "There was an error saving your code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSavingCode(false)
    }
  }

  const handleDeleteCode = async () => {
    if (!designId) return

    if (!confirm("Are you sure you want to delete this code? This action cannot be undone.")) {
      return
    }

    setIsDeletingCode(true)

    try {
      console.log("Deleting code for design:", designId)
      const result = await removeCode(designId)

      if (result.success) {
        console.log("Code deleted successfully")
        toast({
          title: "Code deleted",
          description: "Your website code has been deleted successfully.",
        })
        setGeneratedCode(null)
        setSavedCodeExists(false)
      } else {
        console.error("Failed to delete code:", result.error)
        toast({
          title: "Error deleting code",
          description: "There was an error deleting your code. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting code:", error)
      toast({
        title: "Error deleting code",
        description: "There was an error deleting your code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeletingCode(false)
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
          <Link href={`/dashboard/projects/${id}/designs/${designId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Design
          </Link>
        </Button>

        {generatedCode && (
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => handleSaveCode()}
              disabled={isSavingCode}
              className="border-green-500 text-green-500 hover:bg-green-50"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSavingCode ? "Saving..." : savedCodeExists ? "Update Code" : "Save Code"}
            </Button>

            {savedCodeExists && (
              <Button
                variant="outline"
                onClick={handleDeleteCode}
                disabled={isDeletingCode}
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                <Trash className="mr-2 h-4 w-4" />
                {isDeletingCode ? "Deleting..." : "Delete Code"}
              </Button>
            )}
          </div>
        )}
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

      {generatedCode && (
        <>
          {/* Add a prominent save button at the top of the code display */}
          <div className="mb-6 flex justify-center">
            <Card className="w-full max-w-2xl">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Save Your Generated Code</h2>
                  <p className="text-gray-500">Don't forget to save your code to access it later</p>
                </div>
                <Button
                  onClick={() => handleSaveCode()}
                  disabled={isSavingCode}
                  size="lg"
                  className="bg-beehive-yellow text-beehive-black hover:bg-beehive-hover w-full sm:w-auto"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {isSavingCode ? "Saving..." : savedCodeExists ? "Update Code" : "Save Code"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <CodeDisplay code={generatedCode} />

          {/* Add another save button at the bottom for convenience */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => handleSaveCode()}
              disabled={isSavingCode}
              size="lg"
              className="bg-beehive-yellow text-beehive-black hover:bg-beehive-hover"
            >
              <Save className="mr-2 h-5 w-5" />
              {isSavingCode ? "Saving..." : savedCodeExists ? "Update Code" : "Save Code"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

