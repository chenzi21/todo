"use server";
import { NextRequest } from "next/server";
import FetchWithCookies from "./fetchUtils";

export async function getIsAuthenticated(request: NextRequest) {
    "use server";
    const sessionCookie = request.cookies.get("session");

    console.log("sessionCookie", sessionCookie)

    if (!sessionCookie) return false;

    try {
        const response = await FetchWithCookies("authenticateSession", {
            method: "POST",
            body: JSON.stringify({
                sessionId: sessionCookie.value
            }),
            cache: "no-store",
        })

        console.log("res", response.ok, response.status)

        return response.ok;
    } catch (e: any) {
        console.log(e);
        return false
    }
}
