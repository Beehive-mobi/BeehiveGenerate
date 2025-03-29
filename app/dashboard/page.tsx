import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, Code, Save, Settings, FileCode, Plus } from "lucide-react"
import { NewProjectForm } from "@/components/new-project-form"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <NewProjectForm />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Saved Designs</CardTitle>
            <CardDescription>View and manage your saved website designs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-6">
              <Save className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/saved-designs">View Saved Designs</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create New Design</CardTitle>
            <CardDescription>Start the design process for a new website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-6">
              <Layers className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/onboarding">Create New Design</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generate Code</CardTitle>
            <CardDescription>Generate code for your saved designs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-6">
              <Code className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/saved-designs">Select Design</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Code</CardTitle>
            <CardDescription>View and manage your generated website code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-6">
              <FileCode className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/code">View Generated Code</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Vercel Projects</CardTitle>
            <CardDescription>View and manage your Vercel projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-6">
              <Plus className="h-12 w-12 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground text-center">Create and deploy projects directly to Vercel</p>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button asChild className="w-full">
              <Link href="/dashboard/projects">View Projects</Link>
            </Button>
            <NewProjectForm />
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Database Setup</CardTitle>
            <CardDescription>Initialize and manage your database</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you're setting up for the first time, you'll need to initialize your database.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/init-db">
                <Settings className="mr-2 h-4 w-4" /> Database Setup
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

