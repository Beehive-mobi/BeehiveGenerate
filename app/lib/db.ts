import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string from environment variables
export const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!)

// Update the initializeDatabase function to include deployments and domains tables

export async function initializeDatabase() {
  try {
    console.log("Initializing database...")

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

    // Create designs table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS designs (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
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
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        html TEXT,
        css TEXT,
        javascript TEXT,
        nextjs_components JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_design FOREIGN KEY (design_id) REFERENCES designs(id) ON DELETE CASCADE
      )
    `

    // Create deployments table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS deployments (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        deployment_id TEXT NOT NULL UNIQUE,
        url TEXT NOT NULL,
        status TEXT NOT NULL,
        response_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create domains table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS domains (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        deployment_id INTEGER REFERENCES deployments(id) ON DELETE SET NULL,
        name TEXT NOT NULL UNIQUE,
        verified BOOLEAN DEFAULT FALSE,
        response_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Add project_id column to designs table if it doesn't exist
    try {
      await sql`
        ALTER TABLE designs 
        ADD COLUMN IF NOT EXISTS project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE
      `
    } catch (error) {
      console.log("Column project_id might already exist in designs table")
    }

    // Add project_id column to website_code table if it doesn't exist
    try {
      await sql`
        ALTER TABLE website_code 
        ADD COLUMN IF NOT EXISTS project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE
      `
    } catch (error) {
      console.log("Column project_id might already exist in website_code table")
    }

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

// Design-related database functions
export async function getDesignsByProject(projectId: number) {
  try {
    const designs = await sql`
      SELECT * FROM designs 
      WHERE project_id = ${projectId}
      ORDER BY created_at DESC
    `
    return { success: true, designs }
  } catch (error) {
    console.error("Error fetching designs:", error)
    return { success: false, error }
  }
}

export async function getDesignById(id: number) {
  try {
    const [design] = await sql`
      SELECT * FROM designs WHERE id = ${id}
    `
    if (!design) {
      return { success: false, message: "Design not found" }
    }
    return { success: true, design }
  } catch (error) {
    console.error("Error fetching design:", error)
    return { success: false, error }
  }
}

export async function saveDesign(designData: {
  project_id?: number
  user_id?: string
  company_name: string
  design_name: string
  description?: string
  color_palette?: any
  typography?: any
  layout?: any
  features?: any
  image_style?: string
  preview_images?: any
  id?: number
}) {
  try {
    const {
      id,
      project_id,
      user_id,
      company_name,
      design_name,
      description,
      color_palette,
      typography,
      layout,
      features,
      image_style,
      preview_images,
    } = designData

    if (id) {
      // Update existing design
      const [updated] = await sql`
        UPDATE designs 
        SET 
          project_id = ${project_id || null},
          user_id = ${user_id || null},
          company_name = ${company_name},
          design_name = ${design_name},
          description = ${description || null},
          color_palette = ${color_palette ? JSON.stringify(color_palette) : null},
          typography = ${typography ? JSON.stringify(typography) : null},
          layout = ${layout ? JSON.stringify(layout) : null},
          features = ${features ? JSON.stringify(features) : null},
          image_style = ${image_style || null},
          preview_images = ${preview_images ? JSON.stringify(preview_images) : null},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
      return { success: true, design: updated }
    } else {
      // Insert new design
      const [design] = await sql`
        INSERT INTO designs (
          project_id, user_id, company_name, design_name, description,
          color_palette, typography, layout, features, image_style, preview_images
        ) VALUES (
          ${project_id || null},
          ${user_id || null},
          ${company_name},
          ${design_name},
          ${description || null},
          ${color_palette ? JSON.stringify(color_palette) : null},
          ${typography ? JSON.stringify(typography) : null},
          ${layout ? JSON.stringify(layout) : null},
          ${features ? JSON.stringify(features) : null},
          ${image_style || null},
          ${preview_images ? JSON.stringify(preview_images) : null}
        )
        RETURNING *
      `
      return { success: true, design }
    }
  } catch (error) {
    console.error("Error saving design:", error)
    return { success: false, error }
  }
}

export async function deleteDesign(id: number) {
  try {
    const [deleted] = await sql`
      DELETE FROM designs WHERE id = ${id} RETURNING *
    `
    if (!deleted) {
      return { success: false, message: "Design not found" }
    }
    return { success: true, design: deleted }
  } catch (error) {
    console.error("Error deleting design:", error)
    return { success: false, error }
  }
}

// Code-related database functions
export async function getCodeByProject(projectId: number) {
  try {
    const code = await sql`
      SELECT wc.*, d.design_name, d.company_name
      FROM website_code wc
      JOIN designs d ON wc.design_id = d.id
      WHERE wc.project_id = ${projectId}
      ORDER BY wc.created_at DESC
    `
    return { success: true, code }
  } catch (error) {
    console.error("Error fetching code:", error)
    return { success: false, error }
  }
}

export async function getCodeByDesign(designId: number) {
  try {
    const code = await sql`
      SELECT * FROM website_code 
      WHERE design_id = ${designId}
      ORDER BY created_at DESC
    `
    return { success: true, code }
  } catch (error) {
    console.error("Error fetching code:", error)
    return { success: false, error }
  }
}

export async function getCodeById(id: number) {
  try {
    const [code] = await sql`
      SELECT wc.*, d.design_name, d.company_name
      FROM website_code wc
      JOIN designs d ON wc.design_id = d.id
      WHERE wc.id = ${id}
    `
    if (!code) {
      return { success: false, message: "Code not found" }
    }
    return { success: true, code }
  } catch (error) {
    console.error("Error fetching code:", error)
    return { success: false, error }
  }
}

export async function saveCode(codeData: {
  design_id: number
  project_id?: number
  html?: string
  css?: string
  javascript?: string
  nextjs_components?: any
  id?: number
}) {
  try {
    const { id, design_id, project_id, html, css, javascript, nextjs_components } = codeData

    if (id) {
      // Update existing code
      const [updated] = await sql`
        UPDATE website_code 
        SET 
          design_id = ${design_id},
          project_id = ${project_id || null},
          html = ${html || null},
          css = ${css || null},
          javascript = ${javascript || null},
          nextjs_components = ${nextjs_components ? JSON.stringify(nextjs_components) : null}
        WHERE id = ${id}
        RETURNING *
      `
      return { success: true, code: updated }
    } else {
      // Insert new code
      const [code] = await sql`
        INSERT INTO website_code (
          design_id, project_id, html, css, javascript, nextjs_components
        ) VALUES (
          ${design_id},
          ${project_id || null},
          ${html || null},
          ${css || null},
          ${javascript || null},
          ${nextjs_components ? JSON.stringify(nextjs_components) : null}
        )
        RETURNING *
      `
      return { success: true, code }
    }
  } catch (error) {
    console.error("Error saving code:", error)
    return { success: false, error }
  }
}

export async function deleteCode(id: number) {
  try {
    const [deleted] = await sql`
      DELETE FROM website_code WHERE id = ${id} RETURNING *
    `
    if (!deleted) {
      return { success: false, message: "Code not found" }
    }
    return { success: true, code: deleted }
  } catch (error) {
    console.error("Error deleting code:", error)
    return { success: false, error }
  }
}

// Deployment-related database functions
export async function saveDeployment(deploymentData: {
  project_id: number
  deployment_id: string
  url: string
  status: string
  created_at?: Date
  response_data: any
  id?: number
}) {
  try {
    const { id, project_id, deployment_id, url, status, created_at, response_data } = deploymentData

    if (id) {
      // Update existing deployment
      const [updated] = await sql`
        UPDATE deployments 
        SET 
          project_id = ${project_id},
          deployment_id = ${deployment_id},
          url = ${url},
          status = ${status},
          response_data = ${JSON.stringify(response_data)},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
      return { success: true, deployment: updated }
    } else {
      // Insert new deployment
      const [deployment] = await sql`
        INSERT INTO deployments (
          project_id, deployment_id, url, status, response_data
        ) VALUES (
          ${project_id},
          ${deployment_id},
          ${url},
          ${status},
          ${JSON.stringify(response_data)}
        )
        RETURNING *
      `
      return { success: true, deployment }
    }
  } catch (error) {
    console.error("Error saving deployment:", error)
    return { success: false, error }
  }
}

export async function getDeploymentsByProject(projectId: number) {
  try {
    const deployments = await sql`
      SELECT * FROM deployments 
      WHERE project_id = ${projectId}
      ORDER BY created_at DESC
    `
    return { success: true, deployments }
  } catch (error) {
    console.error("Error fetching deployments:", error)
    return { success: false, error }
  }
}

export async function getDeploymentById(id: number) {
  try {
    const [deployment] = await sql`
      SELECT * FROM deployments WHERE id = ${id}
    `
    if (!deployment) {
      return { success: false, message: "Deployment not found" }
    }
    return { success: true, deployment }
  } catch (error) {
    console.error("Error fetching deployment:", error)
    return { success: false, error }
  }
}

export async function getDeploymentByDeploymentId(deploymentId: string) {
  try {
    const [deployment] = await sql`
      SELECT * FROM deployments WHERE deployment_id = ${deploymentId}
    `
    if (!deployment) {
      return { success: false, message: "Deployment not found" }
    }
    return { success: true, deployment }
  } catch (error) {
    console.error("Error fetching deployment:", error)
    return { success: false, error }
  }
}

export async function deleteDeployment(id: number) {
  try {
    const [deleted] = await sql`
      DELETE FROM deployments WHERE id = ${id} RETURNING *
    `
    if (!deleted) {
      return { success: false, message: "Deployment not found" }
    }
    return { success: true, deployment: deleted }
  } catch (error) {
    console.error("Error deleting deployment:", error)
    return { success: false, error }
  }
}

// Domain-related database functions
export async function saveDomain(domainData: {
  project_id: number
  deployment_id?: number
  name: string
  verified: boolean
  response_data: any
  id?: number
}) {
  try {
    const { id, project_id, deployment_id, name, verified, response_data } = domainData

    if (id) {
      // Update existing domain
      const [updated] = await sql`
        UPDATE domains 
        SET 
          project_id = ${project_id},
          deployment_id = ${deployment_id || null},
          name = ${name},
          verified = ${verified},
          response_data = ${JSON.stringify(response_data)},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
      return { success: true, domain: updated }
    } else {
      // Insert new domain
      const [domain] = await sql`
        INSERT INTO domains (
          project_id, deployment_id, name, verified, response_data
        ) VALUES (
          ${project_id},
          ${deployment_id || null},
          ${name},
          ${verified},
          ${JSON.stringify(response_data)}
        )
        RETURNING *
      `
      return { success: true, domain }
    }
  } catch (error) {
    console.error("Error saving domain:", error)
    return { success: false, error }
  }
}

export async function getDomainsByProject(projectId: number) {
  try {
    const domains = await sql`
      SELECT * FROM domains 
      WHERE project_id = ${projectId}
      ORDER BY created_at DESC
    `
    return { success: true, domains }
  } catch (error) {
    console.error("Error fetching domains:", error)
    return { success: false, error }
  }
}

export async function getDomainById(id: number) {
  try {
    const [domain] = await sql`
      SELECT * FROM domains WHERE id = ${id}
    `
    if (!domain) {
      return { success: false, message: "Domain not found" }
    }
    return { success: true, domain }
  } catch (error) {
    console.error("Error fetching domain:", error)
    return { success: false, error }
  }
}

export async function getDomainByName(name: string) {
  try {
    const [domain] = await sql`
      SELECT * FROM domains WHERE name = ${name}
    `
    if (!domain) {
      return { success: false, message: "Domain not found" }
    }
    return { success: true, domain }
  } catch (error) {
    console.error("Error fetching domain:", error)
    return { success: false, error }
  }
}

export async function deleteDomain(id: number) {
  try {
    const [deleted] = await sql`
      DELETE FROM domains WHERE id = ${id} RETURNING *
    `
    if (!deleted) {
      return { success: false, message: "Domain not found" }
    }
    return { success: true, domain: deleted }
  } catch (error) {
    console.error("Error deleting domain:", error)
    return { success: false, error }
  }
}

