"use client";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UserNameInput from "../inputs/UserNameInput";
import PasswordInput from "../inputs/PasswordInput";
import { useRouter } from "next/navigation";

export type Inputs = {
    username: string;
    password: string;
    confirmPassword: string;
};

const initialState: Inputs = {
    username: "",
    password: "",
    confirmPassword: "",
} as const;

type Props = {
    handleSubmit: (args: Omit<Inputs, "confirmPassword">) => Promise<boolean>;
};

export default function SignUpForm({ handleSubmit }: Props) {
    const router = useRouter();
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
                    const isAuthenticated = await handleSubmit({
                        username: formData.username,
                        password: formData.password,
                    });

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
                        return;
                    }

                    form.reset(initialState);
                    router.push("/todos");
                }}
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

