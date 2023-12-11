//drizzle.config.ts
import type { Config } from "drizzle-kit"

export default {
    schema: "src/db/schema/schema.ts",
    out: "src/db/migrations",
    driver: "pg",
    dbCredentials: {
        // host: process.env.DB_HOST,
        // user: process.env.DB_USER,
        // password: process.env.DB_PASSWORD,
        // database: process.env.DB_NAME,
        connectionString: "",
    },
} satisfies Config
