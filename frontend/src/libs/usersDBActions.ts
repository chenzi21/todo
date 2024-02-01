"use server";

import { cookies } from "next/headers";

type User = {
    username: string;
    password: string;
}

async function setSessionCookie(resBody: any) {
    "use server";

    if ("sessionId" in resBody && typeof resBody.sessionId === "string" && resBody.sessionId.length > 0) {
        const cookieStore = cookies();

        cookieStore.set("session", resBody.sessionId, {
            httpOnly: true,
            secure: true,
            name: "session",
            sameSite: "strict",
            maxAge: 86000
        });

        return;
    } else {
        throw new Error("Failed to set cookie, check sessionId in response body");
    }
}

export async function createUser(user: User) {
    "use server";

    try {
        const response = await fetch("http://server:8080/createUser",
            {
                method: "POST",
                body: JSON.stringify(user),
                cache: "no-store",
            }).then(res => res.json());

        setSessionCookie(response);
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function authenticateUser(user: User) {
    "use server";

    try {
        const response = await fetch("http://server:8080/authenticateUser",
            {
                method: "POST",
                body: JSON.stringify(user),
                cache: "no-store",
            }).then(res => res.json());

        setSessionCookie(response);
    } catch (e: any) {
        throw new Error(e)
    }
}
