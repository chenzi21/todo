"use server";

import TodosTable from "@/components/todosPage/TodosTable";
import { getTodos } from "@/libs/dbActions/todo";
import { Todo } from "@/libs/types/todo";
import { Suspense } from "react";

export default async function Home() {
    const todos = await getTodos();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-[6vw]">
            <Suspense key={"utc"} fallback={<h2>Loading...</h2>}>
                <TodosTable
                    data={
                        todos?.map((todo: Todo) => ({
                            ...todo,
                            date: new Date(todo.date).toLocaleDateString(),
                            is_done: todo.is_done ? "Yes" : "No",
                        })) ?? []
                    }
                />
            </Suspense>
        </main>
    );
}

