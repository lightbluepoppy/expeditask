// migrate.ts
import { migrate } from "drizzle-orm/neon-http/migrator"
import * as server from "db/server"
const main = async () => {
    try {
        await migrate(server.db, { migrationsFolder: "./db/migrations" })
        console.log("Migration complete")
    } catch (error) {
        console.log(error)
    }
    process.exit(0)
}
main()
