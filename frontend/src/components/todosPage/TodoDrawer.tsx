"use client";

import { Todo } from "@/libs/types/todo";
import {
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { finishTodos } from "@/libs/dbActions/todo";
import { toast } from "sonner";
import { modularToast } from "@/libs/toastUtils";
import { useRouter } from "next/navigation";

type Props = {
    todo: Todo & { date: string };
};

export default function TodoDrawer({ todo }: Props) {
    const router = useRouter();

    return (
        <DrawerContent className="p-4">
            <DrawerHeader>
                <DrawerTitle className="p-1 text-left overflow-x-hidden text-ellipsis">
                    {todo.todo}
                </DrawerTitle>
                <DrawerDescription className="p-1 text-left">
                    {todo.date}
                </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-2 align-start p-5">
                <p>urgency: {todo.urgency}</p>
                <p>is done: {todo.is_done}</p>
            </div>
            <DrawerFooter className="flex flex-row justify-center gap-6">
                <Button
                    onClick={() => {
                        try {
                            finishTodos([todo.id]);
                        } catch (e: any) {
                            console.log(e);
                            toast.error("Error Updating To Dos", {
                                description:
                                    "There was a Problem Updating To Dos, Please Try Again Later",
                            });
                            return;
                        }
                        modularToast("Succesfully Updated To Dos", {
                            description: "To Dos were Updated",
                        });
                        router.refresh();
                    }}
                    disabled={todo.is_done === "Yes"}
                >
                    Mark As Done
                </Button>
                <Button
                    onClick={() => router.push(`/editTodo/${todo.id}`)}
                    disabled={todo.is_done === "Yes"}
                >
                    Edit Todo
                </Button>
            </DrawerFooter>
        </DrawerContent>
    );
}

