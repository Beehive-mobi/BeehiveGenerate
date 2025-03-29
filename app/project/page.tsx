import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { NewProjectForm } from "@/components/new-project-form"
import { GitBranch, Github, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getProjects } from "@/app/lib/db"

export default async function ProjectsPage() {
  const result = await getProjects()
  const projects = result.success ? result.projects : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <NewProjectForm />
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No projects found</p>
            <NewProjectForm />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const responseData = project.response_data || {}
            const latestDeployment = responseData.latestDeployments?.[0] || {}

            return (
              <Card key={project.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="grid gap-1">
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{latestDeployment.url || "No deployments yet"}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-auto">
                        <MoreHorizontal className="w-4 h-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/projects/${project.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a
                          href={`https://vercel.com/dashboard/projects/${project.vercel_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open in Vercel
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="text-sm font-semibold">{project.framework || "No framework specified"}</div>
                  <div className="flex items-center gap-4 text-sm">
                    {latestDeployment.createdAt && (
                      <>
                        <div className="flex items-center gap-1">
                          <Github className="w-4 h-4" />
                          <span className="text-muted-foreground">
                            {new Date(latestDeployment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitBranch className="w-4 h-4" />
                          <span className="text-muted-foreground">
                            {latestDeployment.meta?.githubCommitRef || "main"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/dashboard/projects/${project.id}`}>View Details</Link>
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

