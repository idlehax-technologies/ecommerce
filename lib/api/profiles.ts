import { apiFetch } from "./fetch";
import { ProfileDTO } from "@/types/profile";

export const fetchProfile = () =>
    apiFetch<ProfileDTO | null>("/api/profile");

export const saveProfile = (input: ProfileDTO) =>
    apiFetch<ProfileDTO>("/api/profile", {
        method: "POST",
        body: JSON.stringify(input),
    });