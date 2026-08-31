import { profileStore } from "./storage";
import { toNewProfile, toUpdatedProfile } from "./mappers";
import type { ProfileDTO, UserProfile } from "@/types/profile";
import { assertCompleteProfile } from "./guards";

export async function getProfile(
    userId: string
): Promise<UserProfile | null> {
    return profileStore.get(userId);
}

export async function upsertProfile(
    userId: string,
    dto: ProfileDTO
): Promise<UserProfile> {
    assertCompleteProfile(dto);
    const existing = await getProfile(userId);

    if (!existing) {
        const profile = toNewProfile(userId, dto);
        await profileStore.save(profile);
        return profile;
    }

    const updated = toUpdatedProfile(existing, dto);
    await profileStore.save(updated);
    return updated;
}