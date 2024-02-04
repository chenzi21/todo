"use client";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import UserNameInput from "../inputs/UserNameInput";
import PasswordInput from "../inputs/PasswordInput";
import { useRouter } from "next/navigation";
import { FormEvent, FormEventHandler } from "react";

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

    const onSubmit = async (inputs: Inputs) => {
        const isAuthenticated = await handleSubmit(inputs);
        if (isAuthenticated) {
            toast("Authentication was Successful", {
                description: "Great to See You again!",
            });
            router.push("/");
        } else {
            toast("Authentication Failed", {
                description: "if You are Not a Registered user Please Sign up.",
            });
            form.reset(initialState);
        }
        form.reset(initialState);
        router.push("/todos");
    };

    function onSubmitError() {
        toast("Submittion Failed", {
            description: "invalid inputs, please adhere to the input rules.",
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit(onSubmit, onSubmitError);
                }}
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

