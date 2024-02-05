"use client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import UserNameInput from "../inputs/UserNameInput";
import PasswordInput from "../inputs/PasswordInput";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { BaseSyntheticEvent, FormEvent, useCallback } from "react";

export type Inputs = {
    username: string;
    password: string;
};

const initialState = {
    username: "",
    password: "",
} as const;

type Props = {
    handleSubmit: (args: Inputs) => Promise<boolean>;
};

export default function LoginForm({ handleSubmit }: Props) {
    const router = useRouter();
    const form = useForm<Inputs>({
        defaultValues: initialState,
        shouldUseNativeValidation: true,
    });

    const onSubmit = useCallback(
        async (
            inputs: Inputs,
            e?: BaseSyntheticEvent<object, any, any> | undefined
        ) => {
            e?.preventDefault();
            const isAuthenticated = await handleSubmit(inputs);
            if (isAuthenticated) {
                toast("Authentication was Successful", {
                    description: "Great to See You again!",
                });
                router.push("/");
            } else {
                toast("Authentication Failed", {
                    description:
                        "if You are Not a Registered user Please Sign up.",
                });
                form.reset(initialState);
                return;
            }
            form.reset(initialState);
            router.push("/todos");
        },
        [form]
    );

    const onSubmitError = useCallback(
        (_: any, e?: BaseSyntheticEvent<object, any, any> | undefined) => {
            e?.preventDefault();
            toast("Submittion Failed", {
                description:
                    "invalid inputs, please adhere to the input rules.",
            });
        },
        []
    );

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
                className="flex flex-col gap-2"
            >
                <UserNameInput form={form} />
                <PasswordInput form={form} />
                <Button type="submit">Log Me In</Button>
                <Link href="/signup">
                    <p className="text-center">
                        not a user? Click here to sign up
                    </p>
                </Link>
            </form>
        </Form>
    );
}

