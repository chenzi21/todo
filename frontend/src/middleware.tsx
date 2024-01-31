import { NextRequest, NextResponse } from "next/server";
import { getIsAuthenticated } from "./libs/getIsAuthenticated";

export default function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/_next")) {
        return NextResponse.next();
    }

    const isAuthenticated = getIsAuthenticated(request);

    console.log("lol", isAuthenticated);

    if (
        !isAuthenticated &&
        !request.url.includes("/login") &&
        !request.url.includes("/signup")
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

