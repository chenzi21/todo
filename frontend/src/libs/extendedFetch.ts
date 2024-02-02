import { cookies } from "next/headers";

export default function FetchWithCookies(url: string, fetchOptions?: RequestInit | undefined) {
    return fetch(url, {
        ...fetchOptions,
        headers: {
            Cookie: cookies().toString(),
            ...fetchOptions?.headers,
        }
    })
}