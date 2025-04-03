"use client"

function Pages() {
  return ( <div>sacacascas</div> );
}

export default Pages

// 

// import { useEffect, useState } from "react"
// //import { listWebsiteCode, deleteWebsiteCode } from "@/app/lib/code-actions"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Eye, Trash, Copy, Check, ChevronDown, ChevronUp } from "lucide-react"
// import Link from "next/link"
// import { formatDistanceToNow } from "date-fns"
// import { toast } from "@/hooks/use-toast"

// export default function WebsiteCodeListPage() {
//   const [codes, setCodes] = useState<any[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})
//   const [expandedCode, setExpandedCode] = useState<string | null>(null)
//   const [copied, setCopied] = useState<string | null>(null)

//   useEffect(() => {
//     fetchCodes()
//   }, [])

//   const fetchCodes = async () => {
//     try {
//       console.log("Fetching all code entries")
//       setIsLoading(true)
//       //const result = await listWebsiteCode()
//       console.log(result)
//       if (result.success) {
//         console.log(`Fetched ${result.codes.length} code entries`)
//         setCodes(result.codes)
//       } else {
//         console.error("Failed to fetch code entries:", result.error)
//         setError("Failed to load website code")
//       }
//     } catch (err) {
//       console.error("Error fetching code entries:", err)
//       setError("An error occurred while fetching website code")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleDeleteCode = async (designId: string) => {
//     if (!confirm("Are you sure you want to delete this code? This action cannot be undone.")) {
//       return
//     }

//     setIsDeleting((prev) => ({ ...prev, [designId]: true }))

//     try {
//       console.log("Deleting code for design:", designId)
//       //const result = await deleteWebsiteCode(designId)

//       if (result.success) {
//         console.log("Code deleted successfully")
//         toast({
//           title: "Code deleted",
//           description: "The website code has been deleted successfully.",
//         })
//         // Refresh the list
//         fetchCodes()
//       } else {
//         console.error("Failed to delete code:", result.error)
//         toast({
//           title: "Error deleting code",
//           description: "There was an error deleting the code. Please try again.",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error deleting code:", error)
//       toast({
//         title: "Error deleting code",
//         description: "There was an error deleting the code. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsDeleting((prev) => ({ ...prev, [designId]: false }))
//     }
//   }

//   const toggleExpandCode = (id: string) => {
//     if (expandedCode === id) {
//       setExpandedCode(null)
//     } else {
//       setExpandedCode(id)
//     }
//   }

//   const copyToClipboard = (text: string, type: string) => {
//     navigator.clipboard.writeText(text)
//     setCopied(type)
//     setTimeout(() => setCopied(null), 2000)
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-8">
//         <h1 className="text-2xl font-bold mb-6">Generated Website Code</h1>
//         <div className="text-center py-12">Loading website code...</div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-8">
//         <h1 className="text-2xl font-bold mb-6">Generated Website Code</h1>
//         <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-2xl font-bold mb-6">Generated Website Code</h1>

//       {codes.length === 0 ? (
//         <div className="text-center py-12 bg-gray-50 rounded-lg">
//           <p className="text-gray-500">You haven't generated any website code yet.</p>
//           <Button asChild className="mt-4 bg-beehive-yellow text-beehive-black hover:bg-beehive-hover">
//             <Link href="/dashboard/saved-designs">Generate Code</Link>
//           </Button>
//         </div>
//       ) : (
//         <div className="space-y-8">
//           {codes.map((code) => {
//             // Parse nextjs_components if it's a string
//             const nextjsComponents = code.nextjs_components
//               ? typeof code.nextjs_components === "string"
//                 ? JSON.parse(code.nextjs_components)
//                 : code.nextjs_components
//               : { pages: [], components: [], styles: [] }

//             const isExpanded = expandedCode === code.id.toString()

//             return (
//               <Card key={code.id} className="overflow-hidden">
//                 <CardHeader className="pb-2">
//                   <div className="flex justify-between items-center">
//                     <CardTitle className="text-lg">{code.design_name}</CardTitle>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleExpandCode(code.id.toString())}
//                       className="ml-auto"
//                     >
//                       {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                   <p className="text-sm text-gray-500">{code.company_name}</p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Generated {formatDistanceToNow(new Date(code.created_at), { addSuffix: true })}
//                   </p>
//                 </CardHeader>

//                 {isExpanded && (
//                   <CardContent className="pt-4">
//                     <Tabs defaultValue="html">
//                       <TabsList className="grid w-full grid-cols-4">
//                         <TabsTrigger value="html">HTML</TabsTrigger>
//                         <TabsTrigger value="css">CSS</TabsTrigger>
//                         <TabsTrigger value="javascript">JavaScript</TabsTrigger>
//                         <TabsTrigger value="nextjs">Next.js</TabsTrigger>
//                       </TabsList>

//                       <TabsContent value="html" className="mt-4">
//                         <div className="mb-2 flex justify-end">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => copyToClipboard(code.html || "", `html-${code.id}`)}
//                           >
//                             {copied === `html-${code.id}` ? (
//                               <>
//                                 <Check className="mr-2 h-4 w-4" /> Copied
//                               </>
//                             ) : (
//                               <>
//                                 <Copy className="mr-2 h-4 w-4" /> Copy
//                               </>
//                             )}
//                           </Button>
//                         </div>
//                         <pre className="max-h-[300px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
//                           <code>{code.html || "No HTML code available"}</code>
//                         </pre>
//                       </TabsContent>

//                       <TabsContent value="css" className="mt-4">
//                         <div className="mb-2 flex justify-end">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => copyToClipboard(code.css || "", `css-${code.id}`)}
//                           >
//                             {copied === `css-${code.id}` ? (
//                               <>
//                                 <Check className="mr-2 h-4 w-4" /> Copied
//                               </>
//                             ) : (
//                               <>
//                                 <Copy className="mr-2 h-4 w-4" /> Copy
//                               </>
//                             )}
//                           </Button>
//                         </div>
//                         <pre className="max-h-[300px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
//                           <code>{code.css || "No CSS code available"}</code>
//                         </pre>
//                       </TabsContent>

//                       <TabsContent value="javascript" className="mt-4">
//                         <div className="mb-2 flex justify-end">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => copyToClipboard(code.javascript || "", `js-${code.id}`)}
//                             disabled={!code.javascript}
//                           >
//                             {copied === `js-${code.id}` ? (
//                               <>
//                                 <Check className="mr-2 h-4 w-4" /> Copied
//                               </>
//                             ) : (
//                               <>
//                                 <Copy className="mr-2 h-4 w-4" /> Copy
//                               </>
//                             )}
//                           </Button>
//                         </div>
//                         <pre className="max-h-[300px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
//                           <code>{code.javascript || "No JavaScript code available"}</code>
//                         </pre>
//                       </TabsContent>

//                       <TabsContent value="nextjs" className="mt-4">
//                         <Tabs defaultValue="pages">
//                           <TabsList>
//                             <TabsTrigger value="pages">Pages</TabsTrigger>
//                             <TabsTrigger value="components">Components</TabsTrigger>
//                             <TabsTrigger value="styles">Styles</TabsTrigger>
//                           </TabsList>

//                           <TabsContent value="pages" className="mt-4">
//                             {nextjsComponents.pages && nextjsComponents.pages.length > 0 ? (
//                               nextjsComponents.pages.map((page: any, index: number) => (
//                                 <div key={index} className="mb-6">
//                                   <div className="flex items-center justify-between mb-2">
//                                     <h3 className="text-lg font-medium">{page.name}</h3>
//                                     <Button
//                                       variant="outline"
//                                       size="sm"
//                                       onClick={() => copyToClipboard(page.code, `page-${code.id}-${index}`)}
//                                     >
//                                       {copied === `page-${code.id}-${index}` ? (
//                                         <>
//                                           <Check className="mr-2 h-4 w-4" /> Copied
//                                         </>
//                                       ) : (
//                                         <>
//                                           <Copy className="mr-2 h-4 w-4" /> Copy
//                                         </>
//                                       )}
//                                     </Button>
//                                   </div>
//                                   <pre className="max-h-[200px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
//                                     <code>{page.code}</code>
//                                   </pre>
//                                 </div>
//                               ))
//                             ) : (
//                               <div className="text-center py-4 text-gray-500">No Next.js pages available</div>
//                             )}
//                           </TabsContent>

//                           <TabsContent value="components" className="mt-4">
//                             {nextjsComponents.components && nextjsComponents.components.length > 0 ? (
//                               nextjsComponents.components.map((component: any, index: number) => (
//                                 <div key={index} className="mb-6">
//                                   <div className="flex items-center justify-between mb-2">
//                                     <h3 className="text-lg font-medium">{component.name}</h3>
//                                     <Button
//                                       variant="outline"
//                                       size="sm"
//                                       onClick={() => copyToClipboard(component.code, `component-${code.id}-${index}`)}
//                                     >
//                                       {copied === `component-${code.id}-${index}` ? (
//                                         <>
//                                           <Check className="mr-2 h-4 w-4" /> Copied
//                                         </>
//                                       ) : (
//                                         <>
//                                           <Copy className="mr-2 h-4 w-4" /> Copy
//                                         </>
//                                       )}
//                                     </Button>
//                                   </div>
//                                   <pre className="max-h-[200px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
//                                     <code>{component.code}</code>
//                                   </pre>
//                                 </div>
//                               ))
//                             ) : (
//                               <div className="text-center py-4 text-gray-500">No Next.js components available</div>
//                             )}
//                           </TabsContent>

//                           <TabsContent value="styles" className="mt-4">
//                             {nextjsComponents.styles && nextjsComponents.styles.length > 0 ? (
//                               nextjsComponents.styles.map((style: any, index: number) => (
//                                 <div key={index} className="mb-6">
//                                   <div className="flex items-center justify-between mb-2">
//                                     <h3 className="text-lg font-medium">{style.name}</h3>
//                                     <Button
//                                       variant="outline"
//                                       size="sm"
//                                       onClick={() => copyToClipboard(style.code, `style-${code.id}-${index}`)}
//                                     >
//                                       {copied === `style-${code.id}-${index}` ? (
//                                         <>
//                                           <Check className="mr-2 h-4 w-4" /> Copied
//                                         </>
//                                       ) : (
//                                         <>
//                                           <Copy className="mr-2 h-4 w-4" /> Copy
//                                         </>
//                                       )}
//                                     </Button>
//                                   </div>
//                                   <pre className="max-h-[200px] overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
//                                     <code>{style.code}</code>
//                                   </pre>
//                                 </div>
//                               ))
//                             ) : (
//                               <div className="text-center py-4 text-gray-500">No Next.js styles available</div>
//                             )}
//                           </TabsContent>
//                         </Tabs>
//                       </TabsContent>
//                     </Tabs>
//                   </CardContent>
//                 )}

//                 <CardFooter className={`flex justify-between ${isExpanded ? "border-t pt-4" : ""}`}>
//                   <Button variant="outline" size="sm" asChild>
//                     <Link href={`/dashboard/designs/${code.design_id}/code`}>
//                       <Eye className="mr-2 h-4 w-4" /> View Full
//                     </Link>
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="border-red-500 text-red-500 hover:bg-red-50"
//                     onClick={() => handleDeleteCode(code.design_id)}
//                     disabled={isDeleting[code.design_id]}
//                   >
//                     <Trash className="mr-2 h-4 w-4" />
//                     {isDeleting[code.design_id] ? "Deleting..." : "Delete"}
//                   </Button>
//                 </CardFooter>
//               </Card>
//             )
//           })}
//         </div>
//       )}
//     </div>
//   )
// }

