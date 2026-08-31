import type { Tenant } from "@/types/tenant";
import { prisma } from "@/lib/db/prisma";

export const tenantStore = {
    async get(tenantId: string): Promise<Tenant | null> {
        const tenant = await prisma.tenant.findUnique({
            where: { tenantId },
        });

        if (!tenant) {
            return null;
        }

        return {
            tenantId: tenant.tenantId,
            name: tenant.name,
            address: tenant.address,
            state: tenant.state as Tenant["state"],
            gstin: tenant.gstin ?? undefined,
            status: tenant.status,
            createdAt: tenant.createdAt.toISOString(),
            updatedAt: tenant.updatedAt.toISOString(),
        };
    },

    async getAll(): Promise<Tenant[]> {
        const tenants = await prisma.tenant.findMany();

        return tenants.map((tenant) => ({
            tenantId: tenant.tenantId,
            name: tenant.name,
            address: tenant.address,
            state: tenant.state as Tenant["state"],
            gstin: tenant.gstin ?? undefined,
            status: tenant.status,
            createdAt: tenant.createdAt.toISOString(),
            updatedAt: tenant.updatedAt.toISOString(),
        }));
    },

    async save(tenant: Tenant): Promise<void> {
        await prisma.tenant.upsert({
            where: {
                tenantId: tenant.tenantId,
            },
            create: {
                tenantId: tenant.tenantId,
                name: tenant.name,
                address: tenant.address,
                state: tenant.state,
                gstin: tenant.gstin ?? null,
                status: tenant.status,
                createdAt: new Date(tenant.createdAt),
                updatedAt: new Date(tenant.updatedAt),
            },
            update: {
                name: tenant.name,
                address: tenant.address,
                state: tenant.state,
                gstin: tenant.gstin ?? null,
                status: tenant.status,
                updatedAt: new Date(tenant.updatedAt),
            },
        });
    },
};