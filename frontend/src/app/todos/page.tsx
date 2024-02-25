"use server";

import TodosTable from "@/components/todosPage/todosTable";
import { getTodos } from "@/libs/dbActions/todo";
import { Suspense } from "react";

export default async function Home() {
    const todos = await getTodos();

    return (
        <main
            className="flex min-h-screen flex-col items-center justify-between p-[10vw]"
            style={{ minHeight: "100%" }}
        >
            <Suspense key={"utc"} fallback={<h2>Loading...</h2>}>
                <TodosTable data={todos ?? []} />
            </Suspense>
        </main>
    );
}

