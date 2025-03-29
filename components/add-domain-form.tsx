"use client"

import { useState } from "react"
import { addDomain } from "@/app/lib/domain-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface AddDomainFormProps {
  projectId: number
  deploymentId?: number
  buttonText?: string
}

export function AddDomainForm({ projectId, deploymentId, buttonText = "Add Domain" }: AddDomainFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await addDomain(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setIsOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add domain",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Domain</DialogTitle>
          <DialogDescription>Enter a domain name to add to your project.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <Input type="hidden" name="project_id" value={projectId} />
          {deploymentId && <Input type="hidden" name="deployment_id" value={deploymentId} />}
          <div className="grid gap-2">
            <Label htmlFor="name">Domain Name</Label>
            <Input id="name" name="name" placeholder="example.com" required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Domain"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

