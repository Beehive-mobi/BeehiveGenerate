import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string from environment variables
export const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!)

// Function to initialize the database with required tables
export async function initializeDatabase() {
  try {
    console.log("Initializing database...")

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
    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, error }
  }
}

