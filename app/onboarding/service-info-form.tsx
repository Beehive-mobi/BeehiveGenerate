"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

const formSchema = z.object({
  targetAudience: z.string().min(5, {
    message: "Please describe your target audience.",
  }),
  mainServices: z.array(z.string()).min(1, {
    message: "Please add at least one service or product.",
  }),
  uniqueSellingPoints: z.string().min(10, {
    message: "Please describe what makes your business unique.",
  }),
  hasPhysicalLocation: z.boolean().default(false),
  locationDetails: z.string().optional(),
})

export default function ServiceInfoForm({ onSubmit }) {
  const [serviceInput, setServiceInput] = useState("")
  const [services, setServices] = useState<string[]>([
    "Web Development",
    "Mobile App Development",
    "Cloud Solutions",
    "Digital Marketing",
  ])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetAudience:
        "Small to medium-sized businesses looking to establish or improve their digital presence. Our ideal clients are forward-thinking companies in tech, retail, healthcare, and professional services sectors.",
      mainServices: ["Web Development", "Mobile App Development", "Cloud Solutions", "Digital Marketing"],
      uniqueSellingPoints:
        "We combine technical expertise with business strategy to deliver solutions that not only look great but also drive real business results. Our agile development process ensures quick turnaround times and continuous improvement.",
      hasPhysicalLocation: true,
      locationDetails: "123 Tech Avenue, Suite 500\nSan Francisco, CA 94105\nOpen Monday-Friday: 9am-5pm",
    },
  })

  const addService = () => {
    if (serviceInput.trim() !== "") {
      const updatedServices = [...services, serviceInput.trim()]
      setServices(updatedServices)
      form.setValue("mainServices", updatedServices)
      setServiceInput("")
    }
  }

  const removeService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index)
    setServices(updatedServices)
    form.setValue("mainServices", updatedServices)
  }

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values)
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Tell us about your services and products</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Who is your target audience?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your ideal customers or clients..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This helps us tailor the design to appeal to your specific audience.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mainServices"
            render={() => (
              <FormItem>
                <FormLabel>What services or products do you offer?</FormLabel>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Add a service or product"
                        value={serviceInput}
                        onChange={(e) => setServiceInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addService()
                          }
                        }}
                      />
                    </FormControl>
                    <Button type="button" variant="outline" onClick={addService}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md border p-3">
                        <span>{service}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeService(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="uniqueSellingPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What makes your business unique?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your unique selling points, competitive advantages..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This helps us highlight your strengths in the design.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasPhysicalLocation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Do you have a physical location?</FormLabel>
                  <FormDescription>Check this if you have a store, office, or other physical location.</FormDescription>
                </div>
              </FormItem>
            )}
          />

          {form.watch("hasPhysicalLocation") && (
            <FormField
              control={form.control}
              name="locationDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Address, hours, contact information..." className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>
                    This information will be used for the contact section of your website.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full bg-beehive-yellow text-beehive-black hover:bg-beehive-hover">
            Continue
          </Button>
        </form>
      </Form>
    </div>
  )
}

