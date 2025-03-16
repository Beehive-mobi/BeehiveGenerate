import { neon } from "@neondatabase/serverless"

console.log(process.env.DATABASE_URL!)

// Create a SQL client with the connection string from environment variables
export const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!)

// Function to initialize the database with required tables
export async function initializeDatabase() {
  try {
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

    console.log("Database initialized successfully")
    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, error }
  }
}

