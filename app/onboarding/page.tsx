"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import CompanyInfoForm from "./company-info-form"
import ServiceInfoForm from "./service-info-form"
import DesignPreferencesForm from "./design-preferences-form"
import DesignResults from "./design-results"
import { generateWebsiteDesigns } from "../lib/ai-service"
import type { CompanyInfo, DesignPreferences, OnboardingData, ServiceInfo, WebsiteDesigns } from "../lib/schema"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { initializeDatabase } from "../lib/db"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingData>({
    company: {} as CompanyInfo,
    services: {} as ServiceInfo,
    designPreferences: {} as DesignPreferences,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [designs, setDesigns] = useState<WebsiteDesigns>([])
  const [error, setError] = useState<string | null>(null)
  const [dbInitialized, setDbInitialized] = useState(false)

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = async (data: any) => {
    if (step === 1) {
      setFormData({ ...formData, company: data })
    } else if (step === 2) {
      setFormData({ ...formData, services: data })
    } else if (step === 3) {
      const updatedFormData = { ...formData, designPreferences: data }
      setFormData(updatedFormData)

      // Initialize database if not already done
      // if (!dbInitialized) {
      //   try {
      //     const result = await initializeDatabase()
      //     if (result.success) {
      //       setDbInitialized(true)
      //     }
      //   } catch (error) {
      //     console.error("Error initializing database:", error)
      //   }
      // }

      // Generate designs using AI
      setIsGenerating(true)
      setError(null)
      try {
        const generatedDesigns = await generateWebsiteDesigns(updatedFormData)
        setDesigns(generatedDesigns)
      } catch (error) {
        console.error("Error generating designs:", error)
        setError("There was an error generating your designs. We've created some sample designs instead.")
      } finally {
        setIsGenerating(false)
        setStep(4)
      }
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Create Your Website with Beehive</h1>
        <p className="mt-2 text-gray-500">Tell us about your business and we'll generate the perfect website for you</p>
      </div>

      <div className="mb-8">
        <Progress
          value={progress}
          className="h-2 w-full bg-gray-200"
          style={{
            "--tw-bg-opacity": 1,
            backgroundColor: "rgba(229, 231, 235, var(--tw-bg-opacity))",
            "--progress-background": "#FFD100",
          }}
        />
        <div className="mt-2 flex justify-between text-sm">
          <span className={step >= 1 ? "font-medium" : "text-gray-500"}>Company Info</span>
          <span className={step >= 2 ? "font-medium" : "text-gray-500"}>Services & Products</span>
          <span className={step >= 3 ? "font-medium" : "text-gray-500"}>Design Preferences</span>
          <span className={step >= 4 ? "font-medium" : "text-gray-500"}>Results</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mx-auto max-w-4xl">
        <CardContent className="p-6">
          {step === 1 && <CompanyInfoForm onSubmit={handleNext} />}
          {step === 2 && <ServiceInfoForm onSubmit={handleNext} />}
          {step === 3 && <DesignPreferencesForm onSubmit={handleNext} />}
          {step === 4 && <DesignResults designs={designs} onboardingData={formData} />}

          {isGenerating && (
            <div className="mt-6 text-center">
              <div className="mb-4 text-lg font-medium">Generating your website designs with Claude AI...</div>
              <Progress value={undefined} className="h-2 w-full animate-pulse" />
              <p className="mt-2 text-sm text-gray-500">
                This may take a moment as our AI creates custom designs for you.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {step > 1 && step < 4 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-beehive-black text-beehive-black hover:bg-beehive-light"
              >
                Back
              </Button>
            )}
            {step === 4 && (
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="border-beehive-black text-beehive-black hover:bg-beehive-light"
              >
                Go to Dashboard
              </Button>
            )}
            {step === 4 && (
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-beehive-yellow text-beehive-black hover:bg-beehive-hover"
              >
                Finish
              </Button>
            )}
            {step === 1 && <div />}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

