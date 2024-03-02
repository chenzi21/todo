"use server";

import CDate from "../CDate";
import FetchWithCookies from "../fetchUtils";
import { TodoInputs } from "../types/todo";

export async function addTodo(formValues: TodoInputs) {
    "use server";

    try {
        FetchWithCookies("addTodo",
            {
                method: "POST",
                body: JSON.stringify({
                    todo: formValues.todo,
                    urgency: formValues.urgency,
                    date: new CDate(formValues.date).toDateTime(),
                }),
                cache: "no-store",
            });
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function editTodo(formValues: TodoInputs, todoId: number) {
    "use server";

    try {
        FetchWithCookies("editTodo",
            {
                method: "POST",
                body: JSON.stringify({
                    todo: formValues.todo,
                    urgency: formValues.urgency,
                    date: new CDate(formValues.date).toDateTime(),
                    todoId: Number(todoId),
                }),
                cache: "no-store",
            });
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function finishTodos(ids: number[]) {
    "use server";

    try {
        FetchWithCookies("finishTodos",
            {
                method: "POST",
                body: JSON.stringify({ ids }),
                cache: "no-store",
            });
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function deleteTodo(id: number) {
    "use server";

    try {
        FetchWithCookies("deleteTodo",
            {
                method: "POST",
                body: JSON.stringify({ id }),
                cache: "no-store",
            });
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function getTodos() {
    "use server";

    try {
        return FetchWithCookies("getTodos", {
            method: "GET",
            cache: "no-store",
        }).then((data) => data.json());
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function getTodo(id: number) {
    "use server";

    try {
        return FetchWithCookies("getTodo", {
            method: "POST",
            body: JSON.stringify({ id }),
            cache: "no-store",
        }).then((data) => data.json());
    } catch (e: any) {
        throw new Error(e)
    }
}
