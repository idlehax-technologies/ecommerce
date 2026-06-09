import { profileStore } from "./storage";
import { toNewProfile, toUpdatedProfile } from "./mappers";
import type { ProfileDTO, UserProfile } from "@/types/profile";
import { assertCompleteProfile } from "./guards";

export function getProfile(userId: string): UserProfile | null {
    return profileStore.get(userId);
}

export function upsertProfile(
    userId: string,
    phone: string,
    dto: ProfileDTO
): UserProfile {
    assertCompleteProfile(dto);
    const existing = getProfile(userId);

    if (!existing) {
        const profile = toNewProfile(userId, phone, dto);
        profileStore.save(profile);
        return profile;
    }

    const updated = toUpdatedProfile(existing, dto);
    profileStore.save(updated);
    return updated;
}