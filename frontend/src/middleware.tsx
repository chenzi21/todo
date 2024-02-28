import { NextRequest, NextResponse } from "next/server";
import { getIsAuthenticated } from "./libs/getIsAuthenticated";

export default async function middleware(request: NextRequest) {
    console.log("in middleware");

    if (request.nextUrl.pathname.startsWith("/_next")) {
        console.log("here", request.nextUrl);
        return NextResponse.next();
    }

    const isAuthenticated = await getIsAuthenticated(request);

    if (
        !isAuthenticated &&
        !request.url.includes("/login") &&
        !request.url.includes("/signup")
    ) {
        console.log("not signed in", request.url);
        console.log("is authenticated: ", isAuthenticated);
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
        isAuthenticated &&
        (request.url.includes("/login") || request.url.includes("/signup"))
    ) {
        return NextResponse.redirect(new URL("/todos", request.url));
    }

    return NextResponse.next();
}

