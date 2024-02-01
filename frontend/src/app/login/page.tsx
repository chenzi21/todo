"use server";

import LoginForm, { Inputs } from "@/components/login/LoginForm";
import { authenticateUser } from "@/libs/usersDBActions";
import { Suspense } from "react";

export async function handleSubmit(args: Inputs): Promise<boolean> {
    "use server";

    try {
        await authenticateUser(args);
    } catch (e: any) {
        console.log(e);
        return false;
    }

    return true;
}

export default async function Login() {
    return (
        <main
            className="flex min-h-screen flex-col items-center justify-between p-24"
            style={{ minHeight: "100%" }}
        >
            <Suspense fallback={<h2>Loading...</h2>}>
                <LoginForm handleSubmit={handleSubmit} />
            </Suspense>
        </main>
    );
}

