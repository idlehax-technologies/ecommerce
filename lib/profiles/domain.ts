import { profileStore } from "./storage";
import { toNewProfile } from "./mappers";
import type { UpsertProfileInput, UserProfile } from "@/types/profile";
import { assertCompleteProfile } from "./guards";

export function getProfile(userId: string): UserProfile | null {
    return profileStore.get(userId);
}

export function upsertProfile(
    userId: string,
    phone: string,
    input: UpsertProfileInput
): UserProfile {
    assertCompleteProfile(input);

    const existing = profileStore.get(userId);

    if (!existing) {
        const p = toNewProfile(userId, phone, input);
        profileStore.save(p);
        return p;
    }

    const updated: UserProfile = {
        ...existing,
        ...input,
        updatedAt: new Date().toISOString(),
    };

    profileStore.save(updated);
    return updated;
}