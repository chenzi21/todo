"use server";

import { randomUUID } from "crypto";
import { createClient } from "redis";

type UserId = string

type SessionId =  string;

const redisClient = createClient({
    url: "redis://cache:6379",
    password: "password"
});

export async function createSession(userId: UserId): Promise<SessionId | void> {
    "use server";

    const sessionId = randomUUID();
    
    try {
        if (!redisClient.isOpen) await redisClient.connect();
        redisClient.set("session:", `${sessionId}_${userId}`)
    } catch(e: any) {
        throw new Error(e)
    }

    return sessionId
    
}

export async function getSession(): Promise<UserId | null> {
    "use server";

    try {
        if (!redisClient.isOpen) await redisClient.connect();
        return redisClient.get("session:")
    } catch(e: any) {
        throw new Error(e)
    }
}
