"use server";

import { cookies } from "next/headers";
import FetchWithCookies from "../fetchUtils";

export type User = {
    username: string;
    password: string;
}

async function setSessionCookie(response: Response) {
    "use server";

    const body = await response.json();

    if ("sessionId" in body && typeof body.sessionId === "string" && body.sessionId.length > 0) {
        const cookieStore = cookies();

        await new Promise<void>((res, _) => {
            cookieStore.set("session", body.sessionId, {
                httpOnly: true,
                secure: true,
                domain: process.env.NODE_ENV === "production" ? "chenzadik.com" : "localhost",
                name: "session",
                sameSite: "strict",
                path: "/",
                maxAge: 86000
            });
            res();
        })
    } else {
        throw new Error("Failed to set cookie, check sessionId in response body");
    }
}

export async function createUser(user: User) {
    "use server";

    try {
        const response = await FetchWithCookies("createUser",
            {
                method: "POST",
                body: JSON.stringify(user),
                cache: "no-store",
            });

        setSessionCookie(response);
    } catch (e: any) {
        console.log(e);
        throw new Error(e);
    }
}

export async function authenticateUser(user: User) {
    "use server";

    const response = await FetchWithCookies("authenticateUser",
        {
            method: "POST",
            body: JSON.stringify(user),
            cache: "no-store",
        });

    if (response.ok) {
        setSessionCookie(response);
    } else {
        throw new Error(response.status.toString());
    }
}
