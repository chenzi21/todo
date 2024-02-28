import { NextRequest, NextResponse } from "next/server";
import { getIsAuthenticated } from "./libs/getIsAuthenticated";

export default async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/_next")) {
        return NextResponse.next();
    }

    const isAuthenticated = await getIsAuthenticated(request);

    if (
        !isAuthenticated &&
        !request.url.includes("/login") &&
        !request.url.includes("/signup")
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
        isAuthenticated &&
        (request.url.includes("/login") || request.url.includes("/signup"))
    ) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

