"use server";

import SignUpForm from "@/components/signup/SignupForm";
import { createUser } from "@/libs/usersDBActions";
import { Suspense } from "react";

export default async function Signup() {
    return (
        <main
            className="flex min-h-screen flex-col items-center justify-between p-24"
            style={{ minHeight: "100%" }}
        >
            <Suspense fallback={<h2>Loading...</h2>}>
                <SignUpForm handleSubmit={createUser} />
            </Suspense>
        </main>
    );
}

