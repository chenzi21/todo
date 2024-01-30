"use client";

import { useRouter } from "next/navigation";
import CDate from "@/libs/CDate";
import ToDoDatePicker from "./inputs/ToDoDatePicker";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addTodo } from "@/libs/todoDBActions";

export type Inputs = {
	todo: string;
	date: CDate;
	urgency: number;
};

const initialState = {
	todo: "",
	date: new CDate(),
	urgency: 1,
} as const;

export default function ToDoFrom() {
	const router = useRouter();
	const form = useForm<Inputs>({
		defaultValues: initialState,
		shouldUseNativeValidation: true,
	});

	const handleSubmit = useCallback(() => {
		const formValues = form.getValues();
		try {
			addTodo(formValues)
		} catch (e: any) {
			console.log(e);
			toast("To Do failed to Create", {
				description: "Please Check Inputs and Try Again",
			});
			return;
		}
		form.reset(initialState);
		toast("To Do has Succesfully Created", {
			description: `To Do was Created for ${new CDate(formValues.date).toDateTime()}`,
		});
		router.refresh();
	}, []);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2">
				<FormField
					control={form.control}
					name="todo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>To Do</FormLabel>
							<FormControl>
								<Input
									{...form.register("todo", { required: true, minLength: 2 })}
									{...field}
									name="todo"
									placeholder="Enter a TODO..."
									type="text"
								/>
							</FormControl>
							<FormDescription>a Text Input for Your To Do Item</FormDescription>
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
								<ToDoDatePicker {...field} setInput={({ date }) => form.setValue("date", date)} name="date" type="date" />
							</FormControl>
							<FormDescription>a Date Input for your To Do Item</FormDescription>
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
								<Input {...field} name="urgency" type="number" />
							</FormControl>
							<FormDescription>an Input for the Urgency of your To Do Item</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
