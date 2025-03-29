import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { fetchProjectDetails } from "@/app/lib/project-actions"
import { DeleteProjectButton } from "@/components/delete-project-button"
import { ArrowLeft, ExternalLink } from "lucide-react"

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    return notFound()
  }

  const result = await fetchProjectDetails(id)

  if (!result.success) {
    return notFound()
  }

  const { project } = result
  const responseData = project.response_data || {}

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/projects">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{project.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Information about your Vercel project</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Project ID</dt>
                  <dd className="text-sm">{project.vercel_id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Framework</dt>
                  <dd className="text-sm">{project.framework || "Not specified"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                  <dd className="text-sm">{new Date(project.created_at).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                  <dd className="text-sm">{new Date(project.updated_at).toLocaleString()}</dd>
                </div>
              </dl>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Deployments</h3>
                {responseData.latestDeployments && responseData.latestDeployments.length > 0 ? (
                  <div className="space-y-4">
                    {responseData.latestDeployments.map((deployment: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{deployment.url}</p>
                              <p className="text-sm text-muted-foreground">
                                Created: {new Date(deployment.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`https://${deployment.url}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Visit
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No deployments found</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raw Response Data</CardTitle>
              <CardDescription>The raw JSON response from Vercel API</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Manage your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" asChild>
                <a
                  href={`https://vercel.com/dashboard/projects/${project.vercel_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Vercel
                </a>
              </Button>

              <DeleteProjectButton id={project.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

