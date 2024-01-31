"use server";

import SignUpForm, { Inputs } from "@/components/signup/SignupForm";
import { createUser } from "@/libs/usersDBActions";
import { Suspense } from "react";

export async function handleSubmit(
    args: Omit<Inputs, "confirmPassword">
): Promise<boolean> {
    "use server";

    try {
        await createUser(args);
        return true;
    } catch (e: any) {
        console.log(e);
        return false;
    }
}

export default async function Signup() {
    return (
        <main
            className="flex min-h-screen flex-col items-center justify-between p-24"
            style={{ minHeight: "100%" }}
        >
            <Suspense fallback={<h2>Loading...</h2>}>
                <SignUpForm handleSubmit={handleSubmit} />
            </Suspense>
        </main>
    );
}

