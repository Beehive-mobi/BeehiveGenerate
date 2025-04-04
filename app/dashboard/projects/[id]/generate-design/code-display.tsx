"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Globe, Rocket, ExternalLink, Server } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { WebsiteCode } from "../../../../lib/schema"
import { deployToVercel } from "../../../../lib/deploy-actions"
import { useParams } from "next/navigation"
import { getProjectById } from "@/app/lib/db"

interface CodeDisplayProps {
  code: WebsiteCode
}

export default function CodeDisplay({ code }: CodeDisplayProps) {
  const [activeTab, setActiveTab] = useState("html")
  const [copied, setCopied] = useState<string | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState("")
  const [customDomain, setCustomDomain] = useState("")
  const [isDomainConnecting, setIsDomainConnecting] = useState(false)
  const [isDomainConnected, setIsDomainConnected] = useState(false)
  const [showDomainForm, setShowDomainForm] = useState(false)
  const [deploymentError, setDeploymentError] = useState<string | null>(null)

  const {id}:any = useParams()

  console.log(
    "CodeDisplay received code structure:",
    JSON.stringify(
      {
        html: typeof code.html,
        css: typeof code.css,
        javascript: typeof code.javascript,
        nextjs: code.nextjs
          ? {
              pages: Array.isArray(code.nextjs.pages) ? code.nextjs.pages.length : "not array",
              components: Array.isArray(code.nextjs.components) ? code.nextjs.components.length : "not array",
              styles: Array.isArray(code.nextjs.styles) ? code.nextjs.styles.length : "not array",
            }
          : "undefined",
      },
      null,
      2,
    ),
  )

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDeploy = async () => {
    setIsDeploying(true)

  

    try {
      // Call the server action to deploy to Vercel
      if(!id){alert('No project ID.')}
      
    
      const result = await deployToVercel(code, id)

      if (result.success && result.url) {
        setIsDeployed(true)
        setDeploymentUrl(result.url)
      } else {
        console.error("Deployment failed:", result.errorMessage)
        // Show an error message to the user
        setDeploymentError(result.errorMessage || "Deployment failed. Please try again.")
      }
    } catch (error) {
      console.error("Error during deployment:", error)
      setDeploymentError("An unexpected error occurred during deployment.")
    } finally {
      setIsDeploying(false)
    }
  }

  const handleConnectDomain = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customDomain) return

    setIsDomainConnecting(true)
    // Simulate domain connection process
    setTimeout(() => {
      setIsDomainConnecting(false)
      setIsDomainConnected(true)
    }, 2000)
  }

  return (
    <div className="mt-8">
      <h2 className="mb-6 text-2xl font-bold">Generated Website Code</h2>

      <Tabs defaultValue="html" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="nextjs">Next.js</TabsTrigger>
          <TabsTrigger value="deploy">Deploy</TabsTrigger>
        </TabsList>

        <TabsContent value="html">
          <Card>
            <CardHeader>
              <CardTitle>HTML</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(code.html || "", "html")}>
                  {copied === "html" ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="max-h-[500px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
                <code>{code.html || "No HTML code available"}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="css">
          <Card>
            <CardHeader>
              <CardTitle>CSS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(code.css || "", "css")}>
                  {copied === "css" ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="max-h-[500px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
                <code>{code.css || "No CSS code available"}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="javascript">
          <Card>
            <CardHeader>
              <CardTitle>JavaScript</CardTitle>
            </CardHeader>
            <CardContent>
              {code.javascript ? (
                <>
                  <div className="mb-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(code.javascript || "", "javascript")}
                    >
                      {copied === "javascript" ? (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" /> Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="max-h-[500px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
                    <code>{code.javascript}</code>
                  </pre>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">No JavaScript code was generated for this design.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nextjs">
          <Card>
            <CardHeader>
              <CardTitle>Next.js Components</CardTitle>
            </CardHeader>
            <CardContent>
              {code.nextjs ? (
                <Tabs defaultValue="pages" className="mt-4">
                  <TabsList>
                    <TabsTrigger value="pages">Pages</TabsTrigger>
                    <TabsTrigger value="components">Components</TabsTrigger>
                    <TabsTrigger value="styles">Styles</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pages">
                    {code.nextjs.pages && code.nextjs.pages.length > 0 ? (
                      code.nextjs.pages.map((page, index) => (
                        <div key={index} className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium">{page.name}</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(page.code, `page-${index}`)}
                            >
                              {copied === `page-${index}` ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-2 h-4 w-4" /> Copy
                                </>
                              )}
                            </Button>
                          </div>
                          <pre className="max-h-[300px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
                            <code>{page.code}</code>
                          </pre>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No Next.js pages were generated for this design.
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="components">
                    {code.nextjs.components && code.nextjs.components.length > 0 ? (
                      code.nextjs.components.map((component, index) => (
                        <div key={index} className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium">{component.name}</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(component.code, `component-${index}`)}
                            >
                              {copied === `component-${index}` ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-2 h-4 w-4" /> Copy
                                </>
                              )}
                            </Button>
                          </div>
                          <pre className="max-h-[300px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
                            <code>{component.code}</code>
                          </pre>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No Next.js components were generated for this design.
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="styles">
                    {code.nextjs.styles && code.nextjs.styles.length > 0 ? (
                      code.nextjs.styles.map((style, index) => (
                        <div key={index} className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium">{style.name}</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(style.code, `style-${index}`)}
                            >
                              {copied === `style-${index}` ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-2 h-4 w-4" /> Copy
                                </>
                              )}
                            </Button>
                          </div>
                          <pre className="max-h-[300px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
                            <code>{style.code}</code>
                          </pre>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No Next.js styles were generated for this design.
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8 text-gray-500">No Next.js code was generated for this design.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy">
          <Card>
            <CardHeader>
              <CardTitle>Deploy Your Website</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {!isDeployed ? (
                  <div className="text-center p-6 border rounded-lg bg-gray-50">
                    <Server className="h-12 w-12 mx-auto mb-4 text-beehive-yellow" />
                    <h3 className="text-xl font-semibold mb-2">Ready to Go Live?</h3>
                    <p className="text-gray-600 mb-6">
                      Deploy your website to Vercel with one click. Your site will be live in minutes with a secure
                      HTTPS connection and global CDN.
                    </p>
                    <Button
                      onClick={handleDeploy}
                      disabled={isDeploying}
                      className="bg-black hover:bg-gray-800 text-white"
                      size="lg"
                    >
                      {isDeploying ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Deploying...
                        </>
                      ) : (
                        <>
                          <Rocket className="mr-2 h-5 w-5" /> Deploy to Vercel
                        </>
                      )}
                    </Button>
                    {deploymentError && (
                      <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                        <p className="font-medium">Deployment Error</p>
                        <p>{deploymentError}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="mt-4 p-4 border rounded-lg bg-green-50">
                      <div className="flex items-center mb-3">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <h4 className="font-semibold text-green-700">Deployment Successful!</h4>
                      </div>
                      <p className="mb-3">Your website has been deployed to:</p>
                      <div className="flex items-center p-3 bg-white rounded-md mb-3">
                        <Globe className="h-5 w-5 text-gray-500 mr-2" />
                        <a
                          href={`https://${deploymentUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-mono"
                        >
                          {`https://${deploymentUrl}`}
                        </a>
                      </div>
                      <p className="text-sm text-gray-600">
                        Your deployment is live and accessible at the URL above. You can now share your website with
                        others.
                      </p>
                    </div>

                    {!showDomainForm && !isDomainConnected ? (
                      <div className="text-center">
                        <Button variant="outline" onClick={() => setShowDomainForm(true)} className="w-full">
                          <Globe className="mr-2 h-4 w-4" /> Connect Custom Domain
                        </Button>
                      </div>
                    ) : null}

                    {showDomainForm && !isDomainConnected ? (
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-4">Connect Custom Domain</h3>
                        <form onSubmit={handleConnectDomain}>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="domain">Domain Name</Label>
                              <Input
                                id="domain"
                                placeholder="example.com"
                                value={customDomain}
                                onChange={(e) => setCustomDomain(e.target.value)}
                                required
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Enter the domain you want to connect to your website.
                              </p>
                            </div>
                            <Button
                              type="submit"
                              className="w-full bg-beehive-yellow text-beehive-black hover:bg-beehive-hover"
                              disabled={isDomainConnecting}
                            >
                              {isDomainConnecting ? (
                                <>
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                  Connecting...
                                </>
                              ) : (
                                "Connect Domain"
                              )}
                            </Button>
                          </div>
                        </form>
                      </div>
                    ) : null}

                    {isDomainConnected && (
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold">Custom Domain</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://${customDomain}`, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" /> Visit
                          </Button>
                        </div>
                        <Alert className="bg-green-50 border-green-200">
                          <Check className="h-4 w-4 text-green-500" />
                          <AlertTitle className="text-green-700 text-sm">Domain Connected</AlertTitle>
                          <AlertDescription className="text-green-600 text-xs">
                            {`https://${customDomain}`} is now connected to your website.
                          </AlertDescription>
                        </Alert>
                        <div className="mt-4 text-xs text-gray-500">
                          <p>
                            DNS records have been configured. It may take up to 24 hours for DNS changes to fully
                            propagate.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex flex-col space-y-2">
              <p className="text-sm text-gray-500">
                Vercel provides a global CDN, automatic HTTPS, and continuous deployment from Git.
              </p>
              <p className="text-xs text-gray-400">
                Note: This is a simulation. In a real application, this would connect to the Vercel API to deploy your
                website.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

