import { RequestHandler } from "@builder.io/qwik-city/middleware/request-handler"
import * as server from "db/server"
import { task } from "db/schema/schema"

export const onRequest: RequestHandler = async ({ json }) => {
    const result = await server.db.insert(task).values({ title: "task2" }).returning()
    json(200, { body: result })
}

export const onGet: RequestHandler = async ({ json }) => {
    const result = await server.db.query.task.findMany()
    json(200, { body: result })
}
