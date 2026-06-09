import type { ProfileDTO, UserProfile } from "@/types/profile";

function now(): string {
    return new Date().toISOString();
}

export function toNewProfile(
    userId: string,
    phone: string,
    dto: ProfileDTO
): UserProfile {
    const timestamp = now();

    return {
        userId,
        phone,
        fullName: dto.fullName.trim(),
        email: dto.email.trim(),
        addressText: dto.addressText.trim(),
        createdAt: timestamp,
        updatedAt: timestamp,
    };
}

export function toUpdatedProfile(
    existing: UserProfile,
    dto: ProfileDTO
): UserProfile {
    return {
        ...existing,

        fullName: dto.fullName.trim(),
        email: dto.email.trim(),
        addressText: dto.addressText.trim(),

        updatedAt: now(),
    };
}
