import { cookies } from "next/headers";

export default async function FetchWithCookies(url: string, fetchOptions?: RequestInit | undefined) {
    const Cookie = cookies().toString();
    try {
        return fetch(url, {
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
}