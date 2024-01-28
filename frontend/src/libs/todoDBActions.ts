"use server";

import { Inputs } from "@/app/addToDo/components/form/ToDoForm";
import CDate from "./CDate";

export async function addTodo(formValues: Inputs) {
    "use server";

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
}