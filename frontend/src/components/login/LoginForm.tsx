"use client";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserNameInput from "../inputs/UserNameInput";
import PasswordInput from "../inputs/PasswordInput";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useCallback } from "react";
import { User } from "@/libs/dbActions/users";
import { UserLoginInputs } from "@/libs/types/user";
import { modularToast } from "@/libs/toastUtils";
import { toast } from "sonner";

const initialState = {
    username: "",
    password: "",
} as const;

type Props = {
    handleSubmit: (args: User) => Promise<void>;
};

export default function LoginForm({ handleSubmit }: Props) {
    const router = useRouter();
    const form = useForm<UserLoginInputs>({
        defaultValues: initialState,
        shouldUseNativeValidation: true,
    });

    const onSubmit = useCallback(
        async (
            inputs: UserLoginInputs,
            e?: BaseSyntheticEvent<object, any, any> | undefined
        ) => {
            e?.preventDefault();
            try {
                await handleSubmit(inputs);
                modularToast("Authentication was Successful", {
                    description: "Great to See You again!",
                });
                form.reset(initialState);
                router.refresh();
            } catch (e: any) {
                console.log(e);
                toast.error("Authentication Failed", {
                    description:
                        "if You are Not a Registered user Please Sign up.",
                });
                form.reset(initialState);
            }
        },
        [form]
    );

    const onSubmitError = useCallback(
        (_: any, e?: BaseSyntheticEvent<object, any, any> | undefined) => {
            e?.preventDefault();
            toast.error("Submittion Failed", {
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

