"use server";

import TodosTable from "@/components/todosPage/todosTable";
import FetchWithCookies from "@/libs/extendedFetch";
import { Suspense } from "react";

export default async function Home() {
    const todos = await FetchWithCookies("getTodos", {
        cache: "no-store",
    }).then((data) => data.json());

    return (
        <main
            className="flex min-h-screen flex-col items-center justify-between p-24"
            style={{ minHeight: "100%" }}
        >
            <Suspense fallback={<h2>Loading...</h2>}>
                <TodosTable data={todos ?? []} />
            </Suspense>
        </main>
    );
}

