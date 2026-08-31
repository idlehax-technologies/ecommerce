import type { AuthUser } from "@/types/auth";
import { prisma } from "@/lib/db/prisma";

/**
 * ---------- Auth Store ----------
 *
 * Infrastructure only — no business logic.
 *
 * AuthUser.impersonatedBy is runtime/session state and is
 * intentionally not persisted because it has no corresponding
 * field in the Prisma User model.
 */

export const authStore = {
    async getById(userId: string): Promise<AuthUser | undefined> {
        const user = await prisma.user.findUnique({
            where: { userId },
        });

        if (!user) {
            return undefined;
        }

        return {
            userId: user.userId,
            phone: user.phone,
            isSuperadmin: user.isSuperadmin,
            ...(user.activeMembershipId
                ? { activeMembershipId: user.activeMembershipId }
                : {}),
        };
    },

    async getAll(): Promise<AuthUser[]> {
        const users = await prisma.user.findMany();

        return users.map((user) => ({
            userId: user.userId,
            phone: user.phone,
            isSuperadmin: user.isSuperadmin,
            ...(user.activeMembershipId
                ? { activeMembershipId: user.activeMembershipId }
                : {}),
        }));
    },

    async findByPhone(phone: string): Promise<AuthUser | undefined> {
        const user = await prisma.user.findUnique({
            where: { phone },
        });

        if (!user) {
            return undefined;
        }

        return {
            userId: user.userId,
            phone: user.phone,
            isSuperadmin: user.isSuperadmin,
            ...(user.activeMembershipId
                ? { activeMembershipId: user.activeMembershipId }
                : {}),
        };
    },

    async save(user: AuthUser): Promise<void> {
        await prisma.user.upsert({
            where: {
                userId: user.userId,
            },
            create: {
                userId: user.userId,
                phone: user.phone,
                isSuperadmin: user.isSuperadmin,
                activeMembershipId: user.activeMembershipId ?? null,
            },
            update: {
                activeMembershipId: user.activeMembershipId ?? null,
            },
        });
    },
};