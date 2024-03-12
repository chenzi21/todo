"use server";
import dynamic from "next/dynamic";
import { getTodos } from "@/libs/dbActions/todo";
import { Suspense } from "react";
import { Todo } from "@/libs/types/todo";

const TodosTable = dynamic(
    () => import("../../components/todosPage/TodosTable"),
    {
        ssr: false,
    }
);

export default async function Home() {
    const todos = await getTodos();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-[6vw]">
            <Suspense fallback={<h2>Loading...</h2>}>
                <TodosTable
                    data={
                        todos.map((todo: Todo) => ({
                            ...todo,
                            date: new Date(todo.date).toLocaleString(),
                            is_done: todo.is_done ? "Yes" : "No",
                        })) ?? []
                    }
                />
            </Suspense>
        </main>
    );
}

