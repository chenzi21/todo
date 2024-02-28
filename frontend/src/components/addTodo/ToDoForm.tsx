"use client";

import { useRouter } from "next/navigation";
import CDate from "@/libs/CDate";
import ToDoDatePicker from "../inputs/DateTimePicker";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addTodo } from "@/libs/dbActions/todo";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { TodoInputs } from "@/libs/types/todo";
import { modularToast } from "@/libs/toastUtils";
import { toast } from "sonner";
import { urgencyList } from "@/libs/urgencies";

export const initialState = {
    todo: "",
    date: undefined,
    urgency: "low",
};

export default function ToDoFrom() {
    const router = useRouter();

    const form = useForm<TodoInputs & { date: CDate | undefined }>({
        defaultValues: initialState,
        shouldUseNativeValidation: true,
    });

    useEffect(() => {
        form.setValue("date", new CDate());
    }, []);

    const handleSubmit = useCallback(() => {
        const formValues = form.getValues();
        try {
            addTodo(formValues);
        } catch (e: any) {
            console.log(e);
            toast.error("To Do failed to Create", {
                description: "Please Check Inputs and Try Again",
            });
            return;
        }
        form.reset({ ...initialState, date: new CDate() });
        modularToast("To Do has Succesfully Created", {
            description: `To Do was Created for ${new CDate(
                formValues.date
            ).toDateTime()}`,
        });
        router.push("/todos");
    }, []);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-6"
            >
                <FormField
                    control={form.control}
                    name="todo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>To Do</FormLabel>
                            <FormControl>
                                <Input
                                    {...form.register("todo", {
                                        required: true,
                                        minLength: 2,
                                    })}
                                    {...field}
                                    name="todo"
                                    placeholder="Enter a TODO..."
                                    type="text"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col min-width[max-content]">
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <ToDoDatePicker
                                    {...field}
                                    setInput={({ date }) =>
                                        form.setValue("date", date)
                                    }
                                    name="date"
                                    type="date"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="urgency"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Urgency</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "justify-between",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? urgencyList.find(
                                                          (urgency) =>
                                                              urgency.value ===
                                                              field.value
                                                      )?.label
                                                    : "Select language"}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent align="center">
                                        <Command>
                                            <CommandGroup>
                                                {urgencyList.map((urgency) => (
                                                    <CommandItem
                                                        value={urgency.label}
                                                        key={urgency.value}
                                                        onSelect={() => {
                                                            form.setValue(
                                                                "urgency",
                                                                urgency.value
                                                            );
                                                        }}
                                                    >
                                                        {urgency.label}
                                                        <CheckIcon
                                                            className={cn(
                                                                "ml-auto h-4 w-4",
                                                                urgency.value ===
                                                                    field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}

