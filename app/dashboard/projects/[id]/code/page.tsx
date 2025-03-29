import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchCodeByProject } from "@/app/lib/code-actions"
import { getProjectById } from "@/app/lib/db"
import { ArrowLeft, FileCode } from "lucide-react"

export default async function ProjectCodePage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    return notFound()
  }

  const projectResult = await getProjectById(id)

  if (!projectResult.success) {
    return notFound()
  }

  const { project } = projectResult
  const codeResult = await fetchCodeByProject(id)
  const codeItems = codeResult.success ? codeResult.code : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/projects/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Code for {project.name}</h1>
      </div>

      {codeItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileCode className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No code found for this project</p>
            <Button asChild>
              <Link href={`/dashboard/projects/${id}/designs`}>View Designs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {codeItems.map((code) => (
            <Card key={code.id}>
              <CardHeader>
                <CardTitle>{code.design_name}</CardTitle>
                <CardDescription>{code.company_name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-6">
                  <FileCode className="h-12 w-12 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Created: {new Date(code.created_at).toLocaleString()}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/projects/${id}/code/${code.id}`}>View Code</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

