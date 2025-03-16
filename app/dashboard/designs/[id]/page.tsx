"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getDesignById, deleteDesign } from "@/app/lib/design-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Type, Layout, Code, ArrowLeft, Laptop, Smartphone, Tablet } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

export default function DesignDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [design, setDesign] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState("desktop")

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

  const handleDeleteDesign = async () => {
    if (!confirm("Are you sure you want to delete this design? This action cannot be undone.")) {
      return
    }

    try {
      const result = await deleteDesign(params.id)

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

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard/saved-designs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Saved Designs
          </Link>
        </Button>
        <Button className="bg-beehive-yellow text-beehive-black hover:bg-beehive-hover" asChild>
          <Link href={`/dashboard/designs/${params.id}/code`}>
            <Code className="mr-2 h-4 w-4" /> Generate Code
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
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="colors">
                <Palette className="mr-2 h-4 w-4" /> Colors
              </TabsTrigger>
              <TabsTrigger value="typography">
                <Type className="mr-2 h-4 w-4" /> Typography
              </TabsTrigger>
              <TabsTrigger value="layout">
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
            <Link href={`/dashboard/designs/${params.id}/code`}>
              <Code className="mr-2 h-4 w-4" /> Generate Code
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

