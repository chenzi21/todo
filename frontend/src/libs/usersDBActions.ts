"use server";

type User = {
    username: string;
    password: string;
}

export async function createUser(user: User) {
    "use server";

    try {
        fetch("http://server:8080/createUser",
        {
            method: "POST",
            body: JSON.stringify(user),
            cache: "no-store",
        });
    } catch(e: any) {
        throw new Error(e)
    }
}

export async function authenticateUser(user: User) {
    "use server";

    try {
        fetch("http://server:8080/authenticateUser",
        {
            method: "POST",
            body: JSON.stringify(user),
            cache: "no-store",
        });
    } catch(e: any) {
        throw new Error(e)
    }
}
