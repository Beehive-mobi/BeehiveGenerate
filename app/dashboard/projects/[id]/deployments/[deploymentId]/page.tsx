import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { fetchDeploymentDetails } from "@/app/lib/deploy-actions"
import { fetchDomainsByProject } from "@/app/lib/domain-actions"
import { DeleteDeploymentButton } from "@/components/delete-deployment-button"
import { AssignDomainForm } from "@/components/assign-domain-form"
import { AddDomainForm } from "@/components/add-domain-form"
import { ArrowLeft, Globe, LinkIcon } from "lucide-react"

export default async function DeploymentDetailPage({ params }: { params: { id: string; deploymentId: string } }) {
  const projectId = Number.parseInt(params.id)
  const deploymentId = Number.parseInt(params.deploymentId)

  if (isNaN(projectId) || isNaN(deploymentId)) {
    return notFound()
  }

  const deploymentResult = await fetchDeploymentDetails(deploymentId)

  if (!deploymentResult.success) {
    return notFound()
  }

  const { deployment } = deploymentResult
  const domainsResult = await fetchDomainsByProject(projectId)
  const domains = domainsResult.success ? domainsResult.domains : []

  const status = deployment.status.toLowerCase()
  const statusColor = status === "ready" ? "text-green-500" : status === "error" ? "text-red-500" : "text-yellow-500"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/projects/${projectId}/deployments`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold truncate">{deployment.url}</h1>
        <span className={`text-sm font-medium ${statusColor} ml-2`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Details</CardTitle>
              <CardDescription>Information about your deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Deployment ID</dt>
                  <dd className="text-sm">{deployment.deployment_id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">URL</dt>
                  <dd className="text-sm">
                    <a
                      href={`https://${deployment.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      {deployment.url}
                      <Globe className="h-3 w-3 ml-1" />
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd className={`text-sm ${statusColor}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                  <dd className="text-sm">{new Date(deployment.created_at).toLocaleString()}</dd>
                </div>
              </dl>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Assigned Domains</h3>
                {domains.filter((domain) => domain.deployment_id === deployment.id).length > 0 ? (
                  <div className="space-y-4">
                    {domains
                      .filter((domain) => domain.deployment_id === deployment.id)
                      .map((domain) => (
                        <Card key={domain.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium flex items-center">
                                  {domain.name}
                                  {domain.verified && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                      Verified
                                    </span>
                                  )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Added: {new Date(domain.created_at).toLocaleString()}
                                </p>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <a href={`https://${domain.name}`} target="_blank" rel="noopener noreferrer">
                                  <Globe className="h-4 w-4 mr-2" />
                                  Visit
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <LinkIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No domains assigned to this deployment</p>
                    <div className="flex gap-4">
                      <AssignDomainForm
                        projectId={projectId}
                        deploymentId={deployment.id}
                        domains={domains.filter((domain) => !domain.deployment_id)}
                      />
                      <AddDomainForm projectId={projectId} deploymentId={deployment.id} />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Manage your deployment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" asChild>
                <a href={`https://${deployment.url}`} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Deployment
                </a>
              </Button>

              <AssignDomainForm
                projectId={projectId}
                deploymentId={deployment.id}
                domains={domains.filter((domain) => !domain.deployment_id)}
                buttonText="Assign Domain"
              />

              <AddDomainForm projectId={projectId} deploymentId={deployment.id} buttonText="Add New Domain" />

              <DeleteDeploymentButton id={deployment.id} projectId={projectId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raw Response Data</CardTitle>
              <CardDescription>The raw JSON response from Vercel API</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96">
                {JSON.stringify(deployment.response_data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

