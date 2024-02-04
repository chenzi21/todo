import { NextRequest } from "next/server";

export function getIsAuthenticated(request: NextRequest) {
    const sessionId = request.cookies.get("session");

    return !!sessionId
}