import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchDomainsByProject } from "@/app/lib/domain-actions"
import { getProjectById } from "@/app/lib/db"
import { AddDomainForm } from "@/components/add-domain-form"
import { ArrowLeft, Globe, LinkIcon } from "lucide-react"

export default async function ProjectDomainsPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    return notFound()
  }

  const projectResult = await getProjectById(id)

  if (!projectResult.success) {
    return notFound()
  }

  const { project } = projectResult
  const domainsResult = await fetchDomainsByProject(id)
  const domains = domainsResult.success ? domainsResult.domains : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/projects/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Domains for {project.name}</h1>
        <div className="ml-auto">
          <AddDomainForm projectId={id} />
        </div>
      </div>

      {domains.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <LinkIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No domains found for this project</p>
            <AddDomainForm projectId={id} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain) => (
            <Card key={domain.id}>
              <CardHeader>
                <CardTitle>{domain.name}</CardTitle>
                <CardDescription>
                  {domain.verified ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Verified</span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Not Verified</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-6">
                  <LinkIcon className="h-12 w-12 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Added: {new Date(domain.created_at).toLocaleString()}</p>
                {domain.deployment_id && <p className="text-sm text-muted-foreground mt-2">Assigned to deployment</p>}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/dashboard/projects/${id}/domains/${domain.id}`}>View Details</Link>
                </Button>
                {domain.verified && (
                  <Button asChild className="flex-1">
                    <a href={`https://${domain.name}`} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

