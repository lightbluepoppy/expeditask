// server.ts
import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http"
import { neon, neonConfig } from "@neondatabase/serverless"
import * as schema from "db/schema/schema"

neonConfig.fetchConnectionCache = true
const connection = neon(process.env.DATABASE_URL!)
export const db = drizzle(connection, { schema })
