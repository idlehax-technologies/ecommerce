import type { Membership } from "@/types/membership";
import { prisma } from "@/lib/db/prisma";

export const membershipStore = {
    async get(membershipId: string): Promise<Membership | null> {
        const membership = await prisma.membership.findUnique({
            where: { membershipId },
        });

        if (!membership) {
            return null;
        }

        return {
            membershipId: membership.membershipId,
            userId: membership.userId,
            tenantId: membership.tenantId,
            role: membership.role,
            status: membership.status,
            createdAt: membership.createdAt.toISOString(),
            updatedAt: membership.updatedAt.toISOString(),
        };
    },

    async getAll(): Promise<Membership[]> {
        const memberships = await prisma.membership.findMany();

        return memberships.map((membership) => ({
            membershipId: membership.membershipId,
            userId: membership.userId,
            tenantId: membership.tenantId,
            role: membership.role,
            status: membership.status,
            createdAt: membership.createdAt.toISOString(),
            updatedAt: membership.updatedAt.toISOString(),
        }));
    },

    async listByUser(userId: string): Promise<Membership[]> {
        const memberships = await prisma.membership.findMany({
            where: { userId },
        });

        return memberships.map((membership) => ({
            membershipId: membership.membershipId,
            userId: membership.userId,
            tenantId: membership.tenantId,
            role: membership.role,
            status: membership.status,
            createdAt: membership.createdAt.toISOString(),
            updatedAt: membership.updatedAt.toISOString(),
        }));
    },

    async listByTenant(tenantId: string): Promise<Membership[]> {
        const memberships = await prisma.membership.findMany({
            where: { tenantId },
        });

        return memberships.map((membership) => ({
            membershipId: membership.membershipId,
            userId: membership.userId,
            tenantId: membership.tenantId,
            role: membership.role,
            status: membership.status,
            createdAt: membership.createdAt.toISOString(),
            updatedAt: membership.updatedAt.toISOString(),
        }));
    },

    async save(membership: Membership): Promise<void> {
        await prisma.membership.upsert({
            where: {
                membershipId: membership.membershipId,
            },
            create: {
                membershipId: membership.membershipId,
                userId: membership.userId,
                tenantId: membership.tenantId,
                role: membership.role,
                status: membership.status,
                createdAt: new Date(membership.createdAt),
                updatedAt: new Date(membership.updatedAt),
            },
            update: {
                role: membership.role,
                status: membership.status,
                updatedAt: new Date(membership.updatedAt),
            },
        });
    },
};