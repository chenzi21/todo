"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type Inputs = {
	username: string;
	password: string;
};

const initialState = {
	username: "",
	password: "",
} as const;

type Props = {
    handleSubmit: (test: any) => Promise<void>;
}

export default function LoginForm({ handleSubmit }: Props) {
	const form = useForm<Inputs>({
		defaultValues: initialState,
		shouldUseNativeValidation: true,
	});

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit} className="flex flex-col gap-2">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>username</FormLabel>
							<FormControl>
								<Input
									{...form.register("username", { required: true, minLength: 2 })}
									{...field}
									name="username"
									type="text"
								/>
							</FormControl>
							<FormDescription>Please enter Your Username</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>password</FormLabel>
							<FormControl>
								<Input {...field} name="password" type="text" />
							</FormControl>
							<FormDescription>Please enter Your Password</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
