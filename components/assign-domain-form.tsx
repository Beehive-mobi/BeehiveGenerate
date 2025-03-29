"use client"

import { useState } from "react"
import { assignDomainToDeployment } from "@/app/lib/domain-actions"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface AssignDomainFormProps {
  projectId: number
  deploymentId: number
  domains: any[]
  buttonText?: string
}

export function AssignDomainForm({
  projectId,
  deploymentId,
  domains,
  buttonText = "Assign Domain",
}: AssignDomainFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState("")
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await assignDomainToDeployment(formData)

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
        description: "Failed to assign domain",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Domain to Deployment</DialogTitle>
          <DialogDescription>Select a domain to assign to this deployment.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <Input type="hidden" name="deployment_id" value={deploymentId} />

          <div className="grid gap-2">
            <Label htmlFor="domain_id">Domain</Label>
            {domains.length > 0 ? (
              <Select name="domain_id" value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger id="domain_id">
                  <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain.id} value={domain.id.toString()}>
                      {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-muted-foreground">No domains available. Please add a domain first.</div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading || domains.length === 0}>
              {isLoading ? "Assigning..." : "Assign Domain"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

