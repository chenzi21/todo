"use server";

import { Inputs } from "@/app/addToDo/components/form/ToDoForm";
import CDate from "./CDate";

export async function addTodo(formValues: Inputs) {
    "use server";

    try {
        fetch("http://server:8080/addTodo",
        {
            method: "POST",
            body: JSON.stringify({
                todo: formValues.todo,
                urgency: Number(formValues.urgency),
                date: new CDate(formValues.date).toDateTime(),
            }),
            cache: "no-store",
        });
    } catch(e: any) {
        throw new Error(e)
    }
}

export async function finishTodos(ids: number[]) {
    "use server";

    try {
        fetch("http://server:8080/finishTodos",
        {
            method: "POST",
            body: JSON.stringify({ ids }),
            cache: "no-store",
        });
    } catch(e: any) {
        throw new Error(e)
    }
}

export async function deleteTodo(id: number) {
    "use server";

    try {
        fetch("http://server:8080/deleteTodo",
        {
            method: "POST",
            body: JSON.stringify({ id }),
            cache: "no-store",
        });
    } catch(e: any) {
        throw new Error(e)
    }
}