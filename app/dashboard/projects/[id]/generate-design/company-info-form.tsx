"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Briefcase, FileText, Globe, ImageIcon } from "lucide-react"

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  industry: z.string({
    required_error: "Please select an industry.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  hasExistingWebsite: z.boolean().default(false),
  logo: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
})

export default function CompanyInfoForm({ onSubmit }) {
  const [showOptionalFields, setShowOptionalFields] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "Beehive Digital Solutions",
      industry: "technology",
      description:
        "We are a digital solutions provider specializing in web development, mobile applications, and cloud services. Our team of experts is dedicated to helping businesses transform their digital presence and streamline operations.",
      hasExistingWebsite: false,
      logo: "",
      website: "",
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="mb-6 text-2xl font-bold">Tell us about your company</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card className="shadow-md border border-gray-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Acme Inc." 
                          {...field}
                          className="border border-gray-300 rounded-md shadow-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        Industry
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border border-gray-300 shadow-sm">
                            <SelectValue placeholder="Select an industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="services">Professional Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border border-gray-200">
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4 text-gray-500" />
                      Company Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your company, mission, and values..."
                        className="resize-none min-h-32 border border-gray-300 shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      This will help us understand your brand and create appropriate designs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
          </Card>
          
          <Card className="shadow-md border border-gray-200">
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="hasExistingWebsite"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <FormLabel className="text-sm font-medium m-0">I have a current website</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setShowOptionalFields(checked);
                        }}
                        className="data-[state=checked]:bg-beehive-yellow"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {showOptionalFields && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          <ImageIcon className="h-4 w-4 text-gray-500" />
                          Logo
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => field.onChange(e.target.value)} 
                            className="border border-gray-300 shadow-sm"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500">
                          Upload your company logo if you have one.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          <Globe className="h-4 w-4 text-gray-500" />
                          Current Website
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com" 
                            {...field} 
                            className="border border-gray-300 shadow-sm"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500">
                          We can use your existing website for reference.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Button 
            type="submit" 
            className="w-full bg-beehive-yellow text-beehive-black hover:bg-beehive-hover shadow-md py-6 rounded-lg text-base font-medium"
          >
            Continue
          </Button>
        </form>
      </Form>
    </div>
  )
}