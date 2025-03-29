"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import CodeDisplay from "@/app/dashboard/projects/[id]/generate-design/code-display"
import type { WebsiteCode } from "@/app/lib/schema"
import { formatDistanceToNow } from "date-fns"

interface PageProps {
  params: {
    id: string
  }
}

export default function CodeVersionPage({ params }: PageProps) {
  const router = useRouter()
  const { id } = React.use(params)
  const [code, setCode] = useState<WebsiteCode | null>(null)
  const [designId, setDesignId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    const fetchCodeVersion = async () => {
      if (!id) return

      try {
        // Fetch the specific code version by ID
        const result = await fetch(`/api/code/${id}`)
        const data = await result.json()

        if (data.success) {
          console.log(data)
          setCode(data.code)
          setDesignId(data.designId)
        } else {
          setError("Failed to load code version")
        }
      } catch (err) {
        setError("An error occurred while fetching the code version")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCodeVersion()
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">Loading code version...</div>
      </div>
    )
  }

  if (error || !code) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error || "Code version not found"}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        {designId && (
          <Button variant="outline" asChild>
            <Link href={`/dashboard/designs/${designId}`}>View Design</Link>
          </Button>
        )}
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Code Version #{id}</h1>
      </div>

      <CodeDisplay code={code} />
    </div>
  )
}

