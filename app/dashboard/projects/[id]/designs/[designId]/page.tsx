"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
//import { getDesignById, deleteDesign } from "@/app/lib/design-actions"
import { fetchDesignDetails } from "@/app/lib/design-actions"
import { getAllCodeVersionsForDesign, getWebsiteCodeByDesignId, deleteWebsiteCode } from "@/app/lib/code-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Palette,
  Type,
  Layout,
  Code,
  ArrowLeft,
  Laptop,
  Smartphone,
  Tablet,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Eye,
  Trash,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface PageProps {
  params: {
    id: string
  }
}

export default function DesignDetailPage({ params }: PageProps) {
  const router = useRouter()
  const { designId } = React.use(params)
  const [design, setDesign] = useState<any>(null)
  const [code, setCode] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState("desktop")
  const [detailTab, setDetailTab] = useState("preview")
  const [expandedCodeSection, setExpandedCodeSection] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [codeVersions, setCodeVersions] = useState<any[]>([])

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "unknown date"
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) return "invalid date"
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "unknown date"
    }
  }

  useEffect(() => {
    const fetchDesign = async () => {
      if (!designId) return

      try {
        const result = await fetchDesignDetails(designId)
        if (result.success) {
          setDesign(result.design)

          // Fetch all code versions for this design
          try {
            const versionsResult = await getAllCodeVersionsForDesign(designId)
            if (versionsResult.success) {
              setCodeVersions(versionsResult.codeVersions)
            }

            // Also fetch the latest code if it exists
            const codeResult = await getWebsiteCodeByDesignId(designId)
            if (codeResult.success) {
              setCode(codeResult.code)
            }
          } catch (err) {
            console.log("Error fetching code versions:", err)
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

  const handleDeleteDesign = async () => {
    if (!designId) return

    if (!confirm("Are you sure you want to delete this design? This action cannot be undone.")) {
      return
    }

    try {
      const result = await deleteDesign(designId)

      if (result.success) {
        toast({
          title: "Design deleted",
          description: "Your design has been deleted successfully.",
        })
        router.push("/dashboard/saved-designs")
      } else {
        toast({
          title: "Error deleting design",
          description: "There was an error deleting your design. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting design:", error)
      toast({
        title: "Error deleting design",
        description: "There was an error deleting your design. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleCodeSection = (section: string) => {
    if (expandedCodeSection === section) {
      setExpandedCodeSection(null)
    } else {
      setExpandedCodeSection(section)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
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

  // Parse JSON fields
  const colorPalette =
    typeof design.color_palette === "string" ? JSON.parse(design.color_palette) : design.color_palette

  const typography = typeof design.typography === "string" ? JSON.parse(design.typography) : design.typography

  const layout = typeof design.layout === "string" ? JSON.parse(design.layout) : design.layout

  const features = typeof design.features === "string" ? JSON.parse(design.features) : design.features

  const previewImages =
    typeof design.preview_images === "string" ? JSON.parse(design.preview_images) : design.preview_images

  const handleDeleteCodeVersion = async (codeId: string) => {
    if (!confirm("Are you sure you want to delete this code version? This action cannot be undone.")) {
      return
    }

    try {
      // Note: We're reusing the deleteWebsiteCode function but passing the code ID instead of design ID
      // In a production app, you might want to create a separate function for this
      const result = await deleteWebsiteCode(codeId)

      if (result.success) {
        toast({
          title: "Code version deleted",
          description: "The code version has been deleted successfully.",
        })

        // Refresh the code versions list
        const versionsResult = await getAllCodeVersionsForDesign(designId)
        if (versionsResult.success) {
          setCodeVersions(versionsResult.codeVersions)
        }
      } else {
        toast({
          title: "Error deleting code version",
          description: "There was an error deleting the code version. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting code version:", error)
      toast({
        title: "Error deleting code version",
        description: "There was an error deleting the code version. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard/saved-designs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Saved Designs
          </Link>
        </Button>
        <Button className="bg-beehive-yellow text-beehive-black hover:bg-beehive-hover" asChild>
          <Link href={`/dashboard/designs/${designId}/code`}>
            <Code className="mr-2 h-4 w-4" /> {code ? "View Full Code" : "Generate Code"}
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{design.design_name}</h1>
        <p className="text-gray-500">Created for {design.company_name}</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="text-lg mb-6">{design.description}</p>

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
                        src={previewImages?.desktop || "/placeholder.svg?height=400&width=600&text=Desktop+Preview"}
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
                        src={previewImages?.tablet || "/placeholder.svg?height=500&width=400&text=Tablet+Preview"}
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
                        src={previewImages?.mobile || "/placeholder.svg?height=600&width=300&text=Mobile+Preview"}
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
                {colorPalette &&
                  Object.entries(colorPalette).map(([name, color]) => (
                    <div key={name} className="text-center">
                      <div
                        className="mx-auto h-16 w-16 rounded-full"
                        style={{ backgroundColor: color as string }}
                      ></div>
                      <p className="mt-2 text-sm font-medium capitalize">{name}</p>
                      <p className="text-xs text-gray-500">{color as string}</p>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="typography" className="mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Heading Font</h4>
                  <p className="text-2xl" style={{ fontFamily: typography?.headingFont }}>
                    {typography?.headingFont || "Not specified"}
                  </p>
                  <p className="text-sm text-gray-500">Used for headings and titles</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Body Font</h4>
                  <p className="text-base" style={{ fontFamily: typography?.bodyFont }}>
                    {typography?.bodyFont || "Not specified"}
                  </p>
                  <p className="text-sm text-gray-500">Used for paragraphs and general text</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="mt-4">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium">Layout Type</h4>
                  <p className="text-gray-700">{layout?.type || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="text-lg font-medium">Sections</h4>
                  <ul className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
                    {layout?.sections?.map((section: string, index: number) => (
                      <li key={index} className="rounded-md bg-gray-100 px-3 py-2 text-sm">
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium">Features</h4>
                  <ul className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
                    {features?.map((feature: string, index: number) => (
                      <li key={index} className="rounded-md bg-beehive-light px-3 py-2 text-sm">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Code Preview Section */}
      {code && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Generated Code</h2>
              <Button className="bg-beehive-yellow text-beehive-black hover:bg-beehive-hover" asChild>
                <Link href={`/dashboard/designs/${designId}/code`}>
                  <Code className="mr-2 h-4 w-4" /> View Full Code
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {/* HTML Section */}
              <div className="border rounded-lg">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleCodeSection("html")}
                >
                  <h3 className="text-lg font-medium">HTML</h3>
                  <Button variant="ghost" size="sm">
                    {expandedCodeSection === "html" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {expandedCodeSection === "html" && (
                  <div className="p-4 border-t">
                    <div className="mb-2 flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(code.html || "", "html")}>
                        {copied === "html" ? (
                          <>
                            <Check className="mr-2 h-4 w-4" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" /> Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="max-h-[200px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
                      <code>{code.html ? code.html.substring(0, 500) + "..." : "No HTML code available"}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* CSS Section */}
              <div className="border rounded-lg">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleCodeSection("css")}
                >
                  <h3 className="text-lg font-medium">CSS</h3>
                  <Button variant="ghost" size="sm">
                    {expandedCodeSection === "css" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {expandedCodeSection === "css" && (
                  <div className="p-4 border-t">
                    <div className="mb-2 flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(code.css || "", "css")}>
                        {copied === "css" ? (
                          <>
                            <Check className="mr-2 h-4 w-4" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" /> Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="max-h-[200px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
                      <code>{code.css ? code.css.substring(0, 500) + "..." : "No CSS code available"}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* JavaScript Section */}
              {code.javascript && (
                <div className="border rounded-lg">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCodeSection("javascript")}
                  >
                    <h3 className="text-lg font-medium">JavaScript</h3>
                    <Button variant="ghost" size="sm">
                      {expandedCodeSection === "javascript" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {expandedCodeSection === "javascript" && (
                    <div className="p-4 border-t">
                      <div className="mb-2 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(code.javascript || "", "javascript")}
                        >
                          {copied === "javascript" ? (
                            <>
                              <Check className="mr-2 h-4 w-4" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" /> Copy
                            </>
                          )}
                        </Button>
                      </div>
                      <pre className="max-h-[200px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
                        <code>
                          {code.javascript ? code.javascript.substring(0, 500) + "..." : "No JavaScript code available"}
                        </code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Next.js Section */}
              {code.nextjs && (
                <div className="border rounded-lg">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCodeSection("nextjs")}
                  >
                    <h3 className="text-lg font-medium">Next.js Components</h3>
                    <Button variant="ghost" size="sm">
                      {expandedCodeSection === "nextjs" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {expandedCodeSection === "nextjs" && (
                    <div className="p-4 border-t">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                          {code.nextjs.pages?.length || 0} pages, {code.nextjs.components?.length || 0} components, and{" "}
                          {code.nextjs.styles?.length || 0} style files generated.
                        </p>

                        {code.nextjs.pages && code.nextjs.pages.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Pages:</h4>
                            <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
                              {code.nextjs.pages.map((page: any, index: number) => (
                                <li key={index} className="rounded-md bg-gray-100 px-3 py-2 text-sm">
                                  {page.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {code.nextjs.components && code.nextjs.components.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Components:</h4>
                            <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
                              {code.nextjs.components.map((component: any, index: number) => (
                                <li key={index} className="rounded-md bg-gray-100 px-3 py-2 text-sm">
                                  {component.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Code Versions Section */}
      {codeVersions.length > 0 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Generated Code Versions</h2>
              <Button className="bg-beehive-yellow text-beehive-black hover:bg-beehive-hover" asChild>
                <Link href={`/dashboard/designs/${designId}/code`}>
                  <Code className="mr-2 h-4 w-4" /> Generate New Code
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {codeVersions.map((version) => (
                <div key={version.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Code Version #{version.id}</h3>
                      <p className="text-sm text-gray-500">Generated {formatDate(version.created_at)}</p>
                      <div className="mt-2 flex gap-2">
                        {version.has_nextjs && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            Next.js
                          </span>
                        )}
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          HTML
                        </span>
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                          CSS
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/code/${version.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteCodeVersion(version.id.toString())}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/dashboard/saved-designs")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Saved Designs
        </Button>
        <div className="space-x-4">
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={handleDeleteDesign}
          >
            Delete Design
          </Button>
          <Button className="bg-beehive-yellow text-beehive-black hover:bg-beehive-hover" asChild>
            <Link href={`/dashboard/designs/${designId}/code`}>
              <Code className="mr-2 h-4 w-4" /> {code ? "View Full Code" : "Generate Code"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

