"use server"

import { initializeDatabase } from "./db"

export async function initDb() {
  const result = await initializeDatabase()
  return result
}

