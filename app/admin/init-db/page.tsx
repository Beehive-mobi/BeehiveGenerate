"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { initDb } from "@/app/lib/init-db"

export default function InitDbPage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; error?: any } | null>(null)

  const handleInitDb = async () => {
    setIsInitializing(true)
    try {
      const initResult = await initDb()
      setResult(initResult)
    } catch (error) {
      setResult({ success: false, error })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Initialize Database</CardTitle>
          <CardDescription>This will create the necessary tables in your Neon PostgreSQL database.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Make sure you have set up the DATABASE_URL environment variable with your Neon PostgreSQL connection string.
          </p>
          {result && (
            <div
              className={`p-4 rounded-md ${result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              {result.success ? (
                <p>Database initialized successfully!</p>
              ) : (
                <div>
                  <p>Error initializing database:</p>
                  <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(result.error, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleInitDb}
            disabled={isInitializing}
            className="w-full bg-beehive-yellow text-beehive-black hover:bg-beehive-hover"
          >
            {isInitializing ? "Initializing..." : "Initialize Database"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

