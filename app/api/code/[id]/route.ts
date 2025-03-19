import { NextResponse } from "next/server"
import { sql } from "@/app/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    // Fetch the code version
    const codeResult = await sql`
      SELECT * FROM website_code WHERE id = ${id}
    `

    if (codeResult.length === 0) {
      return NextResponse.json({ success: false, error: "Code version not found" }, { status: 404 })
    }

    const code = codeResult[0]

    // Parse nextjs_components if it's a string
    let nextjsComponents = null
    if (code.nextjs_components) {
      try {
        nextjsComponents =
          typeof code.nextjs_components === "string" ? JSON.parse(code.nextjs_components) : code.nextjs_components
      } catch (e) {
        console.error("Error parsing nextjs_components:", e)
        nextjsComponents = { pages: [], components: [], styles: [] }
      }
    }

    // Convert the database format back to the WebsiteCode format
    const websiteCode = {
      html: code.html || "",
      css: code.css || "",
      javascript: code.javascript || undefined,
      nextjs: nextjsComponents || {
        pages: [],
        components: [],
        styles: [],
      },
    }

    return NextResponse.json({
      success: true,
      code: websiteCode,
      designId: code.design_id,
    })
  } catch (error) {
    console.error("Error fetching code version:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch code version" }, { status: 500 })
  }
}

