"use server";

import LoginForm from "@/components/login/LoginForm";
import { authenticateUser } from "@/libs/dbActions/users";
import { Suspense } from "react";

export default async function Login() {
    return (
        <main
            className="flex min-h-screen flex-col items-center justify-between p-24"
            style={{ minHeight: "100%" }}
        >
            <Suspense fallback={<h2>Loading...</h2>}>
                <LoginForm handleSubmit={authenticateUser} />
            </Suspense>
        </main>
    );
}

