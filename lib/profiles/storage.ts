import type { UserProfile } from "@/types/profile";
import { prisma } from "@/lib/db/prisma";

export const profileStore = {
    async get(userId: string): Promise<UserProfile | null> {
        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile) {
            return null;
        }

        return {
            userId: profile.userId,
            fullName: profile.fullName,
            email: profile.email,
            addressText: profile.addressText,
            createdAt: profile.createdAt.toISOString(),
            updatedAt: profile.updatedAt.toISOString(),
        };
    },

    async save(profile: UserProfile): Promise<void> {
        await prisma.profile.upsert({
            where: {
                userId: profile.userId,
            },
            create: {
                userId: profile.userId,
                fullName: profile.fullName,
                email: profile.email,
                addressText: profile.addressText,
                createdAt: new Date(profile.createdAt),
                updatedAt: new Date(profile.updatedAt),
            },
            update: {
                fullName: profile.fullName,
                email: profile.email,
                addressText: profile.addressText,
                updatedAt: new Date(profile.updatedAt),
            },
        });
    },
};