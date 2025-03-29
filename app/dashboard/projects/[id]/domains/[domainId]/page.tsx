import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { fetchDomainDetails } from "@/app/lib/domain-actions"
import { fetchDeploymentsByProject } from "@/app/lib/deploy-actions"
import { DeleteDomainButton } from "@/components/delete-domain-button"
import { AssignDomainForm } from "@/components/assign-domain-form"
import { verifyDomain } from "@/app/lib/domain-actions"
import { ArrowLeft, Globe, LinkIcon, RefreshCw } from "lucide-react"

export default async function DomainDetailPage({ params }: { params: { id: string; domainId: string } }) {
  const projectId = Number.parseInt(params.id)
  const domainId = Number.parseInt(params.domainId)

  if (isNaN(projectId) || isNaN(domainId)) {
    return notFound()
  }

  const domainResult = await fetchDomainDetails(domainId)

  if (!domainResult.success) {
    return notFound()
  }

  const { domain } = domainResult
  const deploymentsResult = await fetchDeploymentsByProject(projectId)
  const deployments = deploymentsResult.success ? deploymentsResult.deployments : []

  const verifyDomainAction = async () => {
    "use server"
    return await verifyDomain(domainId)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/projects/${projectId}/domains`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{domain.name}</h1>
        <span className={`text-sm font-medium ml-2 ${domain.verified ? "text-green-500" : "text-yellow-500"}`}>
          {domain.verified ? "Verified" : "Not Verified"}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Domain Details</CardTitle>
              <CardDescription>Information about your domain</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Domain Name</dt>
                  <dd className="text-sm">{domain.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd className={`text-sm ${domain.verified ? "text-green-500" : "text-yellow-500"}`}>
                    {domain.verified ? "Verified" : "Not Verified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                  <dd className="text-sm">{new Date(domain.created_at).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                  <dd className="text-sm">{new Date(domain.updated_at).toLocaleString()}</dd>
                </div>
              </dl>

              {!domain.verified && (
                <>
                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Verification Instructions</h3>
                    <Card>
                      <CardContent className="p-4">
                        <p className="mb-4">To verify your domain, add the following DNS records:</p>

                        {domain.response_data.verification && (
                          <div className="space-y-4">
                            {domain.response_data.verification.map((record: any, index: number) => (
                              <div key={index} className="bg-muted p-4 rounded-md">
                                <p>
                                  <strong>Type:</strong> {record.type}
                                </p>
                                <p>
                                  <strong>Name:</strong> {record.name}
                                </p>
                                <p>
                                  <strong>Value:</strong> {record.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-4">
                          <form action={verifyDomainAction}>
                            <Button type="submit" className="w-full">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Verify Domain
                            </Button>
                          </form>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Assigned Deployment</h3>
                {domain.deployment_id ? (
                  <div className="space-y-4">
                    {deployments
                      .filter((deployment) => deployment.id === domain.deployment_id)
                      .map((deployment) => (
                        <Card key={deployment.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{deployment.url}</p>
                                <p className="text-sm text-muted-foreground">
                                  Created: {new Date(deployment.created_at).toLocaleString()}
                                </p>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/projects/${projectId}/deployments/${deployment.id}`}>
                                  View Deployment
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <LinkIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No deployment assigned to this domain</p>
                    <AssignDomainForm
                      projectId={projectId}
                      deploymentId={0}
                      domains={[domain]}
                      buttonText="Assign to Deployment"
                    />
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
              <CardDescription>Manage your domain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {domain.verified && (
                <Button className="w-full" asChild>
                  <a href={`https://${domain.name}`} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Domain
                  </a>
                </Button>
              )}

              {!domain.verified && (
                <form action={verifyDomainAction}>
                  <Button type="submit" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Verify Domain
                  </Button>
                </form>
              )}

              <DeleteDomainButton id={domain.id} projectId={projectId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raw Response Data</CardTitle>
              <CardDescription>The raw JSON response from Vercel API</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96">
                {JSON.stringify(domain.response_data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

