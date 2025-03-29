import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchDeploymentsByProject } from "@/app/lib/deploy-actions"
import { getProjectById } from "@/app/lib/db"
import { ArrowLeft, Globe, Rocket } from "lucide-react"

export default async function ProjectDeploymentsPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    return notFound()
  }

  const projectResult = await getProjectById(id)

  if (!projectResult.success) {
    return notFound()
  }

  const { project } = projectResult
  const deploymentsResult = await fetchDeploymentsByProject(id)
  const deployments = deploymentsResult.success ? deploymentsResult.deployments : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/projects/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Deployments for {project.name}</h1>
      </div>

      {deployments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Rocket className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No deployments found for this project</p>
            <Button asChild>
              <Link href={`/dashboard/projects/${id}`}>Back to Project</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deployments.map((deployment) => {
            const status = deployment.status.toLowerCase()
            const statusColor =
              status === "ready" ? "text-green-500" : status === "error" ? "text-red-500" : "text-yellow-500"

            return (
              <Card key={deployment.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{deployment.url}</span>
                    <span className={`text-sm font-medium ${statusColor}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </CardTitle>
                  <CardDescription>Deployment ID: {deployment.deployment_id.slice(0, 8)}...</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center py-6">
                    <Rocket className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(deployment.created_at).toLocaleString()}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/dashboard/projects/${id}/deployments/${deployment.id}`}>View Details</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <a href={`https://${deployment.url}`} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit
                    </a>
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

