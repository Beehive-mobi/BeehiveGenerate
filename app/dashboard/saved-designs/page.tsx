"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDesigns } from "@/app/lib/design-actions"
import Image from "next/image"
import { Eye, Code } from "lucide-react"
import Link from "next/link"

export default function SavedDesignsPage() {
  const [designs, setDesigns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const result = await getDesigns()
        if (result.success) {
          setDesigns(result.designs)
        } else {
          setError("Failed to load designs")
        }
      } catch (err) {
        setError("An error occurred while fetching designs")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDesigns()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Saved Designs</h1>
        <div className="text-center py-12">Loading saved designs...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Saved Designs</h1>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Designs</h1>

      {designs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">You haven't saved any designs yet.</p>
          <Button asChild className="mt-4 bg-beehive-yellow text-beehive-black hover:bg-beehive-hover">
            <Link href="/onboarding">Create a Design</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => {
            // Parse preview images if it's a string
            const previewImages =
              typeof design.preview_images === "string" ? JSON.parse(design.preview_images) : design.preview_images

            return (
              <Card key={design.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{design.design_name}</CardTitle>
                  <p className="text-sm text-gray-500">{design.company_name}</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={previewImages?.desktop || "/placeholder.svg?height=400&width=600&text=Design+Preview"}
                      alt={design.design_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/designs/${design.id}`}>
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-beehive-yellow text-beehive-black hover:bg-beehive-hover"
                    asChild
                  >
                    <Link href={`/dashboard/designs/${design.id}/code`}>
                      <Code className="mr-2 h-4 w-4" /> Generate Code
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

