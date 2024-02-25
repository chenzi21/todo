import { cookies } from "next/headers";

export default async function FetchWithCookies(url: string, fetchOptions?: RequestInit | undefined) {
    const Cookie = cookies().toString();

    try {
        return fetch(`http://server:8080/${url}`, {
            ...fetchOptions,
            headers: {
                Cookie,
                ...fetchOptions?.headers,
            }
        })
    } catch (e: any) {
        console.log(e);
        return new Response(null, { status: e.code ?? 500, statusText: e.message ?? "Internal Server Error" })
    }
};

export async function validateAuthResponse(res: Response) {
    if (res.status === 200) return true

    if (res.status === 401) throw new Error("unauthenticated")
};
