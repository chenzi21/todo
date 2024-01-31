"use client";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import UserNameInput from "../inputs/UserNameInput";
import PasswordInput from "../inputs/PasswordInput";

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
    const form = useForm<Inputs>({
        defaultValues: initialState,
        shouldUseNativeValidation: true,
    });

    return (
        <Form {...form}>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = form.getValues();
                    const isAuthenticated = await handleSubmit(formData);
                    if (isAuthenticated) {
                        toast("Authentication was Successful", {
                            description: "Great to See You again!",
                        });
                    } else {
                        toast("Authentication Failed", {
                            description:
                                "if You are Not a Registered user Please Sign up.",
                        });
                        form.reset(initialState);
                    }
                    form.reset(initialState);
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

