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
    <div>
      <h2 className="mb-6 text-2xl font-bold">Design Preferences</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="stylePreference"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Style Preference</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="minimal" />
                      </FormControl>
                      <FormLabel className="font-normal">Minimal & Clean</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="bold" />
                      </FormControl>
                      <FormLabel className="font-normal">Bold & Impactful</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="professional" />
                      </FormControl>
                      <FormLabel className="font-normal">Professional & Corporate</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="creative" />
                      </FormControl>
                      <FormLabel className="font-normal">Creative & Artistic</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="luxury" />
                      </FormControl>
                      <FormLabel className="font-normal">Luxury & Elegant</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="colorScheme"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Color Scheme</FormLabel>
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
                        className={`h-12 w-12 rounded-full bg-gray-400 ${field.value === "neutral" ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      />
                      <FormLabel className="font-normal">Neutral</FormLabel>
                    </FormItem>
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="warm" className="sr-only" />
                      </FormControl>
                      <div
                        className={`h-12 w-12 rounded-full bg-orange-400 ${field.value === "warm" ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      />
                      <FormLabel className="font-normal">Warm</FormLabel>
                    </FormItem>
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="cool" className="sr-only" />
                      </FormControl>
                      <div
                        className={`h-12 w-12 rounded-full bg-blue-400 ${field.value === "cool" ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      />
                      <FormLabel className="font-normal">Cool</FormLabel>
                    </FormItem>
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="bright" className="sr-only" />
                      </FormControl>
                      <div
                        className={`h-12 w-12 rounded-full bg-green-400 ${field.value === "bright" ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      />
                      <FormLabel className="font-normal">Bright</FormLabel>
                    </FormItem>
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="dark" className="sr-only" />
                      </FormControl>
                      <div
                        className={`h-12 w-12 rounded-full bg-gray-800 ${field.value === "dark" ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      />
                      <FormLabel className="font-normal">Dark</FormLabel>
                    </FormItem>
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="yellowBlack" className="sr-only" />
                      </FormControl>
                      <div
                        className={`h-12 w-12 rounded-full bg-gradient-to-r from-[#FFD100] to-[#1A1A1A] ${field.value === "yellowBlack" ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      />
                      <FormLabel className="font-normal">Yellow & Black</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complexity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Design Complexity: {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormDescription>1 = Simple and straightforward, 5 = Feature-rich and detailed</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mustHaveFeatures"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Must-Have Features</FormLabel>
                  <FormDescription>Select the features you want to include in your website.</FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {features.map((feature) => (
                    <FormField
                      key={feature.id}
                      control={form.control}
                      name="mustHaveFeatures"
                      render={({ field }) => {
                        return (
                          <FormItem key={feature.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(feature.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, feature.id])
                                    : field.onChange(field.value?.filter((value) => value !== feature.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{feature.label}</FormLabel>
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

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any specific requirements or preferences..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Share any additional information that might help us create better designs for you.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-beehive-yellow text-beehive-black hover:bg-beehive-hover">
            Generate Designs
          </Button>
        </form>
      </Form>
    </div>
  )
}

