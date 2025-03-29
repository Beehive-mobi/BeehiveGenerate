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

    // Create projects table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        vercel_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        framework TEXT,
        user_id TEXT,
        response_data JSONB NOT NULL,
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

// Project-related database functions
export async function getProjects() {
  try {
    const projects = await sql`
      SELECT * FROM projects ORDER BY created_at DESC
    `
    return { success: true, projects }
  } catch (error) {
    console.error("Error fetching projects:", error)
    return { success: false, error }
  }
}

export async function getProjectById(id: number) {
  try {
    const [project] = await sql`
      SELECT * FROM projects WHERE id = ${id}
    `
    if (!project) {
      return { success: false, message: "Project not found" }
    }
    return { success: true, project }
  } catch (error) {
    console.error("Error fetching project:", error)
    return { success: false, error }
  }
}

export async function getProjectByVercelId(vercelId: string) {
  try {
    const [project] = await sql`
      SELECT * FROM projects WHERE vercel_id = ${vercelId}
    `
    if (!project) {
      return { success: false, message: "Project not found" }
    }
    return { success: true, project }
  } catch (error) {
    console.error("Error fetching project:", error)
    return { success: false, error }
  }
}

export async function saveProject(projectData: {
  vercel_id: string
  name: string
  framework?: string
  user_id?: string
  response_data: any
}) {
  try {
    const { vercel_id, name, framework, user_id, response_data } = projectData

    // Check if project already exists
    const existingResult = await getProjectByVercelId(vercel_id)

    if (existingResult.success) {
      // Update existing project
      const [updated] = await sql`
        UPDATE projects 
        SET 
          name = ${name}, 
          framework = ${framework || null}, 
          user_id = ${user_id || null}, 
          response_data = ${JSON.stringify(response_data)},
          updated_at = CURRENT_TIMESTAMP
        WHERE vercel_id = ${vercel_id}
        RETURNING *
      `
      return { success: true, project: updated }
    } else {
      // Insert new project
      const [project] = await sql`
        INSERT INTO projects (
          vercel_id, name, framework, user_id, response_data
        ) VALUES (
          ${vercel_id}, ${name}, ${framework || null}, ${user_id || null}, ${JSON.stringify(response_data)}
        )
        RETURNING *
      `
      return { success: true, project }
    }
  } catch (error) {
    console.error("Error saving project:", error)
    return { success: false, error }
  }
}

export async function deleteProject(id: number) {
  try {
    const [deleted] = await sql`
      DELETE FROM projects WHERE id = ${id} RETURNING *
    `
    if (!deleted) {
      return { success: false, message: "Project not found" }
    }
    return { success: true, project: deleted }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, error }
  }
}

