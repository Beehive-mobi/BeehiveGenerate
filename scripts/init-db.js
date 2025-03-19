import { neon } from "@neondatabase/serverless"

// Replace with your actual DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set")
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function initializeDatabase() {
  try {
    console.log("Creating designs table...")

    // Create designs table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS designs (
        id SERIAL PRIMARY KEY,
        user_id TEXT,
        company_name TEXT NOT NULL,
        design_name TEXT NOT NULL,
        description TEXT,
        color_palette JSONB,
        typography JSONB,
        layout JSONB,
        features JSONB,
        image_style TEXT,
        preview_images JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("Creating website_code table...")

    // Create website_code table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS website_code (
        id SERIAL PRIMARY KEY,
        design_id INTEGER NOT NULL,
        html TEXT,
        css TEXT,
        javascript TEXT,
        nextjs_components JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_design FOREIGN KEY (design_id) REFERENCES designs(id) ON DELETE CASCADE
      )
    `

    console.log("Database initialized successfully")

    // Check if the tables were created by querying their structure
    const designsTableInfo = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'designs'
    `

    const codeTableInfo = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'website_code'
    `

    console.log("Designs table structure:")
    console.table(designsTableInfo)

    console.log("Website code table structure:")
    console.table(codeTableInfo)

    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, error }
  }
}

// Run the initialization
initializeDatabase()
  .then((result) => {
    if (result.success) {
      console.log("✅ Database setup complete!")
    } else {
      console.error("❌ Database setup failed:", result.error)
    }
  })
  .catch((err) => {
    console.error("Unexpected error:", err)
  })

