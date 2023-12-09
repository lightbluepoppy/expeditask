import { component$, useSignal } from "@builder.io/qwik"
import type { DocumentHead } from "@builder.io/qwik-city"

export default component$(() => {
    return (
        <>
            <h1>Counter Button</h1>
            <Counter />
        </>
    )
})

const Counter = component$(() => {
    const counter = useSignal(0)
    return <button onClick$={() => counter.value++}>{counter.value}</button>
})

export const head: DocumentHead = {
    title: "Dashboard",
    meta: [{ name: "description", content: "User dashboard" }],
}
