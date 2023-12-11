import { component$ } from "@builder.io/qwik"
import { server$ } from "@builder.io/qwik-city"
import { db } from "db/server"
import { task } from "db/schema/schema"
import {
    type DocumentHead,
    routeLoader$,
    routeAction$,
    zod$,
    z,
    Form,
} from "@builder.io/qwik-city"
import styles from "./todolist.module.css"

type ClientTaskListItem = {
    text: string
}

export const clientTaskList: ClientTaskListItem[] = []

export const useClientTaskListLoader = routeLoader$(() => {
    return clientTaskList
})

export const useServerTaskListLoader = routeLoader$(() => {
    const serverTaskList = db.query.task.findMany()
    return serverTaskList
})

export const useAddToTaskListAction = routeAction$(
    async (item) => {
        clientTaskList.push(item)
        const result = await db.insert(task).values({ title: item.text }).returning()
        console.log(result)
        // return {
        //     success: true,
        // }
    },
    zod$({
        text: z.string().trim().min(1),
    }),
)

// export const useAddToServerTaskListAction = server$((item) => {
//     const result = db.insert(task).values({ title: item.title }).returning()
//     console.log(result)
// })

export default component$(() => {
    const taskList = useClientTaskListLoader()
    const action = useAddToTaskListAction()

    return (
        <>
            <div class="container-center container">
                <h1>
                    <span class="highlight">TODO</span> List Original
                </h1>
            </div>

            <div role="presentation" class="ellipsis"></div>

            <div class="container-center container">
                {taskList.value.length === 0 ? (
                    <span class={styles.empty}>No items found</span>
                ) : (
                    <ul class={styles.list}>
                        {taskList.value.map((item, index) => (
                            <li key={`items-${index}`}>{item.text}</li>
                        ))}
                    </ul>
                )}
            </div>

            <div class="container-center container">
                <Form action={action} spaReset>
                    <input type="text" name="text" required class={styles.input} />{" "}
                    <button type="submit" class="button-dark">
                        Add item
                    </button>
                </Form>

                <p class={styles.hint}>
                    PS: This little app works even when JavaScript is disabled.
                </p>
            </div>
        </>
    )
})

export const head: DocumentHead = {
    title: "Qwik Todo List",
}
