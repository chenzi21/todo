"use server";

import { Suspense } from "react";
import EditToDoFrom from "@/components/editTodo/editForm";
import { getTodo } from "@/libs/dbActions/todo";
import { Todo } from "@/libs/types/todo";

export default async function Page({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const todo = (await getTodo(Number(params.id))) as Todo;

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Suspense fallback={<h2>Loading...</h2>}>
                <EditToDoFrom todo={todo} />
            </Suspense>
        </main>
    );
}

