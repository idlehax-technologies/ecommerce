import { apiFetch } from "./fetch";

import type { ProfileDTO } from "@/types/profile";

export async function fetchProfile(): Promise<{
    profile: ProfileDTO | null;
}> {
    return apiFetch<{
        profile: ProfileDTO | null;
    }>("/api/profile");
}

export async function saveProfile(
    input: ProfileDTO
): Promise<{
    profile: ProfileDTO;
}> {
    return apiFetch<{
        profile: ProfileDTO;
    }>("/api/profile", {
        method: "POST",
        body: JSON.stringify(input),
    });
}