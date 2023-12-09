import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import { users } from "./schema"

const client = createClient({ url: "DATABASE_URL", authToken: "DATABASE_AUTH_TOKEN" })

const db = drizzle(client)

const result = await db.select().from(users).all()
