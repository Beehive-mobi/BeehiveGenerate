"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Download, Laptop, Smartphone, Tablet, Palette, Type, Layout, Code } from "lucide-react"
import type { WebsiteDesign, WebsiteCode } from "../lib/schema"
import { generateWebsiteCode } from "../lib/ai-code-generator"
import CodeDisplay from "./code-display"
import Image from "next/image"

interface DesignResultsProps {
  designs: WebsiteDesign[]
}

export default function DesignResults({ designs }: DesignResultsProps) {
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState("desktop")
  const [detailTab, setDetailTab] = useState("preview")
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<WebsiteCode | null>(null)
  const [codeError, setCodeError] = useState<string | null>(null)

  const handleSelectDesign = (id: number) => {
    setSelectedDesign(id)
    // Reset code generation when selecting a new design
    setGeneratedCode(null)
    setCodeError(null)
  }

  const handleGenerateCode = async () => {
    if (!selectedDesign) return

    const design = designs.find((d) => d.id === selectedDesign)
    if (!design) return

    setIsGeneratingCode(true)
    setCodeError(null)

    try {
      const code = await generateWebsiteCode(design)
      setGeneratedCode(code)
    } catch (error) {
      console.error("Error generating code:", error)
      setCodeError("There was an error generating the code. Please try again later.")
    } finally {
      setIsGeneratingCode(false)
    }
  }

  const selectedDesignData = designs.find((d) => d.id === selectedDesign)

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Your Website Designs</h2>
      <p className="mb-6 text-gray-500">
        We've generated three unique designs based on your preferences. Select one to customize further.
      </p>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {designs.map((design) => (
          <Card
            key={design.id}
            className={`overflow-hidden transition-all ${selectedDesign === design.id ? "ring-2 ring-beehive-yellow" : ""}`}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{design.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={design.previewImage || "/placeholder.svg?height=400&width=600&text=Design+Preview"}
                  alt={design.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectDesign(design.id)}
                className={
                  selectedDesign === design.id ? "border-beehive-yellow bg-beehive-light text-beehive-black" : ""
                }
              >
                {selectedDesign === design.id ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Selected
                  </>
                ) : (
                  "Select"
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="mr-2 h-4 w-4" /> Preview
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedDesignData && (
        <div className="rounded-lg border p-6">
          <h3 className="mb-4 text-xl font-semibold">{selectedDesignData.name}</h3>
          <p className="mb-6 text-gray-600">{selectedDesignData.description}</p>

          <Tabs defaultValue="preview" className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="preview" onClick={() => setDetailTab("preview")}>
                Preview
              </TabsTrigger>
              <TabsTrigger value="colors" onClick={() => setDetailTab("colors")}>
                <Palette className="mr-2 h-4 w-4" /> Colors
              </TabsTrigger>
              <TabsTrigger value="typography" onClick={() => setDetailTab("typography")}>
                <Type className="mr-2 h-4 w-4" /> Typography
              </TabsTrigger>
              <TabsTrigger value="layout" onClick={() => setDetailTab("layout")}>
                <Layout className="mr-2 h-4 w-4" /> Layout
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-4">
              <Tabs defaultValue="desktop">
                <TabsList className="grid w-full max-w-xs grid-cols-3">
                  <TabsTrigger value="desktop" onClick={() => setViewMode("desktop")}>
                    <Laptop className="mr-2 h-4 w-4" /> Desktop
                  </TabsTrigger>
                  <TabsTrigger value="tablet" onClick={() => setViewMode("tablet")}>
                    <Tablet className="mr-2 h-4 w-4" /> Tablet
                  </TabsTrigger>
                  <TabsTrigger value="mobile" onClick={() => setViewMode("mobile")}>
                    <Smartphone className="mr-2 h-4 w-4" /> Mobile
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="desktop" className="mt-4">
                  <div className="overflow-hidden rounded-lg border">
                    <div className="relative h-[400px] w-full">
                      <Image
                        src={
                          selectedDesignData.previewImage ||
                          "/placeholder.svg?height=400&width=600&text=Desktop+Preview" ||
                          "/placeholder.svg"
                        }
                        alt="Desktop preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="tablet" className="mt-4">
                  <div className="mx-auto max-w-md overflow-hidden rounded-lg border">
                    <div className="relative h-[500px] w-full">
                      <Image
                        src={
                          selectedDesignData.tabletPreviewImage ||
                          "/placeholder.svg?height=500&width=400&text=Tablet+Preview" ||
                          "/placeholder.svg"
                        }
                        alt="Tablet preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="mobile" className="mt-4">
                  <div className="mx-auto max-w-xs overflow-hidden rounded-lg border">
                    <div className="relative h-[600px] w-full">
                      <Image
                        src={
                          selectedDesignData.mobilePreviewImage ||
                          "/placeholder.svg?height=600&width=300&text=Mobile+Preview" ||
                          "/placeholder.svg"
                        }
                        alt="Mobile preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="colors" className="mt-4">
              <div className="grid gap-4 md:grid-cols-5">
                {Object.entries(selectedDesignData.colorPalette).map(([name, color]) => (
                  <div key={name} className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-full" style={{ backgroundColor: color }}></div>
                    <p className="mt-2 text-sm font-medium capitalize">{name}</p>
                    <p className="text-xs text-gray-500">{color}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="typography" className="mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Heading Font</h4>
                  <p className="text-2xl" style={{ fontFamily: selectedDesignData.typography.headingFont }}>
                    {selectedDesignData.typography.headingFont}
                  </p>
                  <p className="text-sm text-gray-500">Used for headings and titles</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Body Font</h4>
                  <p className="text-base" style={{ fontFamily: selectedDesignData.typography.bodyFont }}>
                    {selectedDesignData.typography.bodyFont}
                  </p>
                  <p className="text-sm text-gray-500">Used for paragraphs and general text</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="mt-4">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium">Layout Type</h4>
                  <p className="text-gray-700">{selectedDesignData.layout.type}</p>
                </div>
                <div>
                  <h4 className="text-lg font-medium">Sections</h4>
                  <ul className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
                    {selectedDesignData.layout.sections.map((section, index) => (
                      <li key={index} className="rounded-md bg-gray-100 px-3 py-2 text-sm">
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium">Features</h4>
                  <ul className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
                    {selectedDesignData.features.map((feature, index) => (
                      <li key={index} className="rounded-md bg-beehive-light px-3 py-2 text-sm">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" className="border-beehive-black text-beehive-black hover:bg-beehive-light">
              Request Changes
            </Button>
            {!generatedCode && (
              <Button
                onClick={handleGenerateCode}
                disabled={isGeneratingCode}
                className="flex items-center gap-2 bg-beehive-yellow text-beehive-black hover:bg-beehive-hover"
              >
                <Code className="h-4 w-4" />
                {isGeneratingCode ? "Generating Code..." : "Generate Code"}
              </Button>
            )}
            <Button className="bg-beehive-yellow text-beehive-black hover:bg-beehive-hover">
              Continue with This Design
            </Button>
          </div>

          {codeError && (
            <div className="mt-4 rounded-md bg-red-50 p-4 text-red-500">
              <p>{codeError}</p>
            </div>
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

          {generatedCode && <CodeDisplay code={generatedCode} />}
        </div>
      )}
    </div>
  )
}

