import { ProfileDTO } from "@/types/profile";

type Json = Record<string, unknown>;

async function handle<T>(res: Response): Promise<T> {
    const data: unknown = await res.json();

    if (!res.ok) {
        const err = data as { error?: string };
        throw new Error(err?.error || "Request failed");
    }

    return data as T;
}

async function get<T>(url: string): Promise<T> {
    const res = await fetch(url);
    return handle<T>(res);
}

async function post<T>(url: string, body?: Json): Promise<T> {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });

    return handle<T>(res);
}

export const fetchProfile = () =>
    get<ProfileDTO | null>("/api/profile");

export const saveProfile = (input: ProfileDTO) =>
    post<void>("/api/profile", input);