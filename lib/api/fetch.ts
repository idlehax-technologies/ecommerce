import { getCsrfToken } from "@/contexts/AuthContext";

export async function apiFetch<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(url, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": getCsrfToken() ?? "",
            ...(options.headers || {}),
        },
        ...options,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const message =
            typeof data === "object" &&
                data &&
                "error" in data &&
                typeof (data as any).error === "string"
                ? (data as any).error
                : "Request failed";

        throw new Error(message);
    }

    return data as T;
}