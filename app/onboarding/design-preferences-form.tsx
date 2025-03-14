"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Sliders, CheckSquare, PenTool, FileText } from "lucide-react"

const formSchema = z.object({
  stylePreference: z.enum(["minimal", "bold", "professional", "creative", "luxury"]),
  colorScheme: z.enum(["neutral", "warm", "cool", "bright", "dark", "yellowBlack"]),
  complexity: z.number().min(1).max(5),
  mustHaveFeatures: z.array(z.string()),
  additionalNotes: z.string().optional(),
})

const features = [
  { id: "blog", label: "Blog" },
  { id: "ecommerce", label: "Online Store" },
  { id: "contact", label: "Contact Form" },
  { id: "gallery", label: "Image Gallery" },
  { id: "testimonials", label: "Testimonials" },
  { id: "social", label: "Social Media Integration" },
  { id: "newsletter", label: "Newsletter Signup" },
  { id: "faq", label: "FAQ Section" },
]

export default function DesignPreferencesForm({ onSubmit }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stylePreference: "professional",
      colorScheme: "yellowBlack",
      complexity: 4,
      mustHaveFeatures: ["contact", "gallery", "testimonials", "social", "blog"],
      additionalNotes:
        "We'd like a clean, modern design that emphasizes our technical expertise while being approachable. The website should have a strong call-to-action for potential clients to schedule consultations.",
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="mb-6 text-2xl font-bold">Design Preferences</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card className="shadow-md border border-gray-200">
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="stylePreference"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <PenTool className="h-4 w-4 text-gray-500" />
                      Style Preference
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0 py-2 px-3 rounded-md hover:bg-gray-50">
                          <FormControl>
                            <RadioGroupItem value="minimal" className="text-beehive-yellow" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Minimal & Clean</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 py-2 px-3 rounded-md hover:bg-gray-50">
                          <FormControl>
                            <RadioGroupItem value="bold" className="text-beehive-yellow" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Bold & Impactful</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 py-2 px-3 rounded-md hover:bg-gray-50">
                          <FormControl>
                            <RadioGroupItem value="professional" className="text-beehive-yellow" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Professional & Corporate</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 py-2 px-3 rounded-md hover:bg-gray-50">
                          <FormControl>
                            <RadioGroupItem value="creative" className="text-beehive-yellow" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Creative & Artistic</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 py-2 px-3 rounded-md hover:bg-gray-50">
                          <FormControl>
                            <RadioGroupItem value="luxury" className="text-beehive-yellow" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Luxury & Elegant</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
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
                name="colorScheme"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Palette className="h-4 w-4 text-gray-500" />
                      Color Scheme
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-4"
                      >
                        <FormItem className="flex flex-col items-center space-y-2">
                          <FormControl>
                            <RadioGroupItem value="neutral" className="sr-only" />
                          </FormControl>
                          <div
                            className={`h-16 w-16 rounded-full bg-gray-400 shadow-sm cursor-pointer hover:opacity-90 transition-opacity ${
                              field.value === "neutral" ? "ring-2 ring-beehive-yellow ring-offset-2" : ""
                            }`}
                            onClick={() => field.onChange("neutral")}
                          />
                          <FormLabel className="font-normal cursor-pointer">Neutral</FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-col items-center space-y-2">
                          <FormControl>
                            <RadioGroupItem value="warm" className="sr-only" />
                          </FormControl>
                          <div
                            className={`h-16 w-16 rounded-full bg-orange-400 shadow-sm cursor-pointer hover:opacity-90 transition-opacity ${
                              field.value === "warm" ? "ring-2 ring-beehive-yellow ring-offset-2" : ""
                            }`}
                            onClick={() => field.onChange("warm")}
                          />
                          <FormLabel className="font-normal cursor-pointer">Warm</FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-col items-center space-y-2">
                          <FormControl>
                            <RadioGroupItem value="cool" className="sr-only" />
                          </FormControl>
                          <div
                            className={`h-16 w-16 rounded-full bg-blue-400 shadow-sm cursor-pointer hover:opacity-90 transition-opacity ${
                              field.value === "cool" ? "ring-2 ring-beehive-yellow ring-offset-2" : ""
                            }`}
                            onClick={() => field.onChange("cool")}
                          />
                          <FormLabel className="font-normal cursor-pointer">Cool</FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-col items-center space-y-2">
                          <FormControl>
                            <RadioGroupItem value="bright" className="sr-only" />
                          </FormControl>
                          <div
                            className={`h-16 w-16 rounded-full bg-green-400 shadow-sm cursor-pointer hover:opacity-90 transition-opacity ${
                              field.value === "bright" ? "ring-2 ring-beehive-yellow ring-offset-2" : ""
                            }`}
                            onClick={() => field.onChange("bright")}
                          />
                          <FormLabel className="font-normal cursor-pointer">Bright</FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-col items-center space-y-2">
                          <FormControl>
                            <RadioGroupItem value="dark" className="sr-only" />
                          </FormControl>
                          <div
                            className={`h-16 w-16 rounded-full bg-gray-800 shadow-sm cursor-pointer hover:opacity-90 transition-opacity ${
                              field.value === "dark" ? "ring-2 ring-beehive-yellow ring-offset-2" : ""
                            }`}
                            onClick={() => field.onChange("dark")}
                          />
                          <FormLabel className="font-normal cursor-pointer">Dark</FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-col items-center space-y-2">
                          <FormControl>
                            <RadioGroupItem value="yellowBlack" className="sr-only" />
                          </FormControl>
                          <div
                            className={`h-16 w-16 rounded-full bg-gradient-to-r from-[#FFD100] to-[#1A1A1A] shadow-sm cursor-pointer hover:opacity-90 transition-opacity ${
                              field.value === "yellowBlack" ? "ring-2 ring-beehive-yellow ring-offset-2" : ""
                            }`}
                            onClick={() => field.onChange("yellowBlack")}
                          />
                          <FormLabel className="font-normal cursor-pointer">Yellow & Black</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
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
                name="complexity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Sliders className="h-4 w-4 text-gray-500" />
                      Design Complexity: {field.value}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      1 = Simple and straightforward, 5 = Feature-rich and detailed
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
                name="mustHaveFeatures"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <CheckSquare className="h-4 w-4 text-gray-500" />
                        Must-Have Features
                      </FormLabel>
                      <FormDescription className="text-xs text-gray-500 mt-1">
                        Select the features you want to include in your website.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature) => (
                        <FormField
                          key={feature.id}
                          control={form.control}
                          name="mustHaveFeatures"
                          render={({ field }) => {
                            return (
                              <FormItem 
                                key={feature.id} 
                                className="flex items-center space-x-3 space-y-0 rounded-md border border-gray-200 p-3 shadow-sm hover:bg-gray-50"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(feature.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, feature.id])
                                        : field.onChange(field.value?.filter((value) => value !== feature.id))
                                    }}
                                    className="data-[state=checked]:bg-beehive-yellow data-[state=checked]:text-beehive-black"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">{feature.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
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
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4 text-gray-500" />
                      Additional Notes (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any specific requirements or preferences..."
                        className="resize-none min-h-24 border border-gray-300 shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Share any additional information that might help us create better designs for you.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full bg-beehive-yellow text-beehive-black hover:bg-beehive-hover shadow-md py-6 rounded-lg text-base font-medium"
          >
            Generate Designs
          </Button>
        </form>
      </Form>
    </div>
  )
}