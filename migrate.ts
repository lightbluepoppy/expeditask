// migrate.ts
import { migrate } from "drizzle-orm/neon-http/migrator"
import { db } from "src/db/server"
const main = async () => {
    try {
        await migrate(db, { migrationsFolder: "./db/migrations" })
        console.log("Migration complete")
    } catch (error) {
        console.log(error)
    }
    process.exit(0)
}
main()
