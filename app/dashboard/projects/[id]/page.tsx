import { CardFooter } from "@/components/ui/card"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { fetchProjectDetails } from "@/app/lib/project-actions"
import { fetchDesignsByProject } from "@/app/lib/design-actions"
import { fetchCodeByProject } from "@/app/lib/code-actions"
import { fetchDeploymentsByProject } from "@/app/lib/deploy-actions"
import { fetchDomainsByProject } from "@/app/lib/domain-actions"
import { DeleteProjectButton } from "@/components/delete-project-button"
//import { NewDesignForm } from "@/components/new-design-form"
import { AddDomainForm } from "@/components/add-domain-form"
import { ArrowLeft, ExternalLink, Palette, FileCode, Rocket, Globe } from "lucide-react"

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

  // Fetch designs, code, deployments, and domains for this project
  const designsResult = await fetchDesignsByProject(id)
  const designs = designsResult.success ? designsResult.designs : []

  const codeResult = await fetchCodeByProject(id)
  const codeItems = codeResult.success ? codeResult.code : []

  const deploymentsResult = await fetchDeploymentsByProject(id)
  const deployments = deploymentsResult.success ? deploymentsResult.deployments : []

  const domainsResult = await fetchDomainsByProject(id)
  const domains = domainsResult.success ? domainsResult.domains : []

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
                {deployments.length > 0 ? (
                  <div className="space-y-4">
                    {deployments.slice(0, 3).map((deployment) => (
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
                              <a href={`https://${deployment.url}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Visit
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {deployments.length > 3 && (
                      <div className="text-center pt-2">
                        <Button asChild variant="outline">
                          <Link href={`/dashboard/projects/${id}/deployments`}>View All Deployments</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No deployments found</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Designs</CardTitle>
                <CardDescription>Designs associated with this project</CardDescription>
              </div>
              {/* <NewDesignForm projectId={id} /> */}
            </CardHeader>
            <CardContent>
              {designs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <Palette className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No designs found for this project</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {designs.slice(0, 3).map((design) => (
                    <Card key={design.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{design.design_name}</p>
                            <p className="text-sm text-muted-foreground">{design.company_name}</p>
                          </div>
                          <Button asChild size="sm">
                            <Link href={`/dashboard/projects/${id}/designs/${design.id}`}>View Design</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {designs.length > 3 && (
                    <div className="text-center pt-2">
                      <Button asChild variant="outline">
                        <Link href={`/dashboard/projects/${id}/designs`}>View All Designs</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/dashboard/projects/${id}/designs`}>
                  {designs.length > 0 ? "View All Designs" : "Create Design"}
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Code</CardTitle>
              <CardDescription>Code generated for this project</CardDescription>
            </CardHeader>
            <CardContent>
              {codeItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <FileCode className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No code has been generated for this project yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {codeItems.slice(0, 3).map((code) => (
                    <Card key={code.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{code.design_name}</p>
                            <p className="text-sm text-muted-foreground">
                              Created: {new Date(code.created_at).toLocaleString()}
                            </p>
                          </div>
                          <Button asChild size="sm">
                            <Link href={`/dashboard/projects/${id}/code/${code.id}`}>View Code</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {codeItems.length > 3 && (
                    <div className="text-center pt-2">
                      <Button asChild variant="outline">
                        <Link href={`/dashboard/projects/${id}/code`}>View All Code</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/dashboard/projects/${id}/code`}>
                  {codeItems.length > 0 ? "View All Code" : "Generate Code"}
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Domains</CardTitle>
                <CardDescription>Domains associated with this project</CardDescription>
              </div>
              <AddDomainForm projectId={id} />
            </CardHeader>
            <CardContent>
              {domains.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No domains found for this project</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {domains.slice(0, 3).map((domain) => (
                    <Card key={domain.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{domain.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {domain.verified ? "Verified" : "Not Verified"}
                            </p>
                          </div>
                          <Button asChild size="sm">
                            <Link href={`/dashboard/projects/${id}/domains/${domain.id}`}>View Domain</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {domains.length > 3 && (
                    <div className="text-center pt-2">
                      <Button asChild variant="outline">
                        <Link href={`/dashboard/projects/${id}/domains`}>View All Domains</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/dashboard/projects/${id}/domains`}>
                  {domains.length > 0 ? "View All Domains" : "Add Domain"}
                </Link>
              </Button>
            </CardFooter>
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

              <Button className="w-full" variant="secondary" asChild>
                <Link href={`/dashboard/projects/${id}/designs`}>
                  <Palette className="h-4 w-4 mr-2" />
                  Manage Designs
                </Link>
              </Button>

              <Button className="w-full" variant="secondary" asChild>
                <Link href={`/dashboard/projects/${id}/code`}>
                  <FileCode className="h-4 w-4 mr-2" />
                  View Code
                </Link>
              </Button>

              <Button className="w-full" variant="secondary" asChild>
                <Link href={`/dashboard/projects/${id}/deployments`}>
                  <Rocket className="h-4 w-4 mr-2" />
                  View Deployments
                </Link>
              </Button>

              <Button className="w-full" variant="secondary" asChild>
                <Link href={`/dashboard/projects/${id}/domains`}>
                  <Globe className="h-4 w-4 mr-2" />
                  Manage Domains
                </Link>
              </Button>

              <DeleteProjectButton id={project.id} />
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
      </div>
    </div>
  )
}

