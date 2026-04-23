import type { UserProfile } from "@/types/profile";

export function toNewProfile(
    userId: string,
    phone: string,
    input: {
        fullName: string;
        email: string;
        addressText: string;
    }
): UserProfile {
    const now = new Date().toISOString();

    return {
        userId,
        phone,
        fullName: input.fullName,
        email: input.email,
        addressText: input.addressText,
        createdAt: now,
        updatedAt: now,
    };
}
