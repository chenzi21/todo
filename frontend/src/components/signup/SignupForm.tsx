"use client";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UserNameInput from "../inputs/UserNameInput";
import PasswordInput from "../inputs/PasswordInput";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent } from "react";
import { User } from "@/libs/usersDBActions";

export type Inputs = User & {
    confirmPassword: string;
};

const initialState: Inputs = {
    username: "",
    password: "",
    confirmPassword: "",
} as const;

type Props = {
    handleSubmit: (args: User) => Promise<void>;
};

export default function SignUpForm({ handleSubmit }: Props) {
    const router = useRouter();
    const form = useForm<Inputs>({
        defaultValues: initialState,
        shouldUseNativeValidation: true,
    });

    const onSubmit = async (
        inputs: Inputs,
        e?: BaseSyntheticEvent<object, any, any> | undefined
    ) => {
        e?.preventDefault();

        try {
            await handleSubmit({
                password: inputs.password,
                username: inputs.username,
            });
            toast("Authentication was Successful", {
                description: "Great to See You again!",
            });
            form.reset(initialState);
            router.push("/todos");
        } catch (e: any) {
            toast("Authentication Failed", {
                description: "if You are Not a Registered user Please Sign up.",
            });
            form.reset(initialState);
        }
    };

    function onSubmitError(
        _: any,
        e?: BaseSyntheticEvent<object, any, any> | undefined
    ) {
        e?.preventDefault();
        toast("Submittion Failed", {
            description: "invalid inputs, please adhere to the input rules.",
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
                className="flex flex-col gap-2"
            >
                <UserNameInput
                    form={form}
                    label="new username"
                    description="Please enter Your Desired Username"
                />
                <PasswordInput
                    form={form}
                    label="new password"
                    description="Please enter Your Desired Password"
                />
                <PasswordInput
                    form={form}
                    inputName="confirmPassword"
                    label="confirm password"
                    description="Please confirm Your Desired Password"
                    registerOptions={{
                        deps: "password",
                        validate: (value, formValues) =>
                            value === formValues.password,
                    }}
                />
                <Button type="submit">Sign Me Up</Button>
            </form>
        </Form>
    );
}

