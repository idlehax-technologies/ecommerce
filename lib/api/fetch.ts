import { getCsrfToken } from "@/contexts/AuthContext";

function isErrorResponse(
    data: unknown
): data is { error: string } {
    return (
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof data.error === "string"
    );
}

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

    const data: unknown = await res
        .json()
        .catch(() => ({}));

    if (!res.ok) {
        throw new Error(
            isErrorResponse(data)
                ? data.error
                : "Request failed"
        );
    }

    return data as T;
}