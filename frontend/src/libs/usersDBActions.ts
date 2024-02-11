"use server";

import { cookies } from "next/headers";
import FetchWithCookies from "./extendedFetch";

export type User = {
    username: string;
    password: string;
}

async function setSessionCookie(response: Response) {
    "use server";

    const body = await response.json();

    if ("sessionId" in body && typeof body.sessionId === "string" && body.sessionId.length > 0) {
        const cookieStore = cookies();

        cookieStore.set("session", body.sessionId, {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            domain: process.env.NODE_ENV === "production" ? "chenzadik.com" : "localhost",
            name: "session",
            sameSite: "none",
            path: "/",
            maxAge: 86000
        });
    } else {
        throw new Error("Failed to set cookie, check sessionId in response body");
    }
}

export async function createUser(user: User) {
    "use server";

    try {
        const response = await FetchWithCookies("http://localhost:8080/createUser",
            {
                method: "POST",
                body: JSON.stringify(user),
                cache: "no-store",
            });

        setSessionCookie(response);
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function authenticateUser(user: User) {
    "use server";

    try {
        const response = await FetchWithCookies("http://localhost:8080/authenticateUser",
            {
                method: "POST",
                body: JSON.stringify(user),
                cache: "no-store",
            });

        setSessionCookie(response);
    } catch (e: any) {
        throw new Error(e)
    }
}
