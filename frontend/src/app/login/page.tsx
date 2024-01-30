"use server";

import LoginForm from "@/components/login/LoginForm";

export async function handleSubmit(test: any) {
    "use server";

    console.log(test);
}

export default async function Login() {
	return (
        <LoginForm handleSubmit={handleSubmit}/>
    );
}
