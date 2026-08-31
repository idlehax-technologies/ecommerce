import type { TenantInventory } from "@/types/tenantInventory";
import { prisma } from "@/lib/db/prisma";

export const tenantInventoryStore = {
    async get(
        tenantId: string,
        productId: string
    ): Promise<TenantInventory | undefined> {
        const record = await prisma.tenantInventory.findUnique({
            where: {
                tenantId_productId: {
                    tenantId,
                    productId,
                },
            },
        });

        if (!record) {
            return undefined;
        }

        return {
            tenantId: record.tenantId,
            productId: record.productId,
            enabled: record.enabled,
            stock: record.stock,
            reserved: record.reserved,
            createdAt: record.createdAt.toISOString(),
            updatedAt: record.updatedAt.toISOString(),
        };
    },

    async listByTenant(
        tenantId: string
    ): Promise<TenantInventory[]> {
        const records = await prisma.tenantInventory.findMany({
            where: { tenantId },
        });

        return records.map((record) => ({
            tenantId: record.tenantId,
            productId: record.productId,
            enabled: record.enabled,
            stock: record.stock,
            reserved: record.reserved,
            createdAt: record.createdAt.toISOString(),
            updatedAt: record.updatedAt.toISOString(),
        }));
    },

    async save(record: TenantInventory): Promise<void> {
        await prisma.tenantInventory.upsert({
            where: {
                tenantId_productId: {
                    tenantId: record.tenantId,
                    productId: record.productId,
                },
            },
            create: {
                tenantId: record.tenantId,
                productId: record.productId,
                enabled: record.enabled,
                stock: record.stock,
                reserved: record.reserved,
                createdAt: new Date(record.createdAt),
                updatedAt: new Date(record.updatedAt),
            },
            update: {
                enabled: record.enabled,
                stock: record.stock,
                reserved: record.reserved,
                updatedAt: new Date(record.updatedAt),
            },
        });
    },

    /**
     * Atomic mutation helper.
     *
     * The read, mutation, and write execute inside a
     * SERIALIZABLE transaction so concurrent inventory
     * mutations cannot silently overwrite one another.
     */
    async update(
        tenantId: string,
        productId: string,
        mutator: (
            record: TenantInventory
        ) => TenantInventory
    ): Promise<TenantInventory | undefined> {
        return prisma.$transaction(
            async (tx) => {
                const record = await tx.tenantInventory.findUnique({
                    where: {
                        tenantId_productId: {
                            tenantId,
                            productId,
                        },
                    },
                });

                if (!record) {
                    return undefined;
                }

                const current: TenantInventory = {
                    tenantId: record.tenantId,
                    productId: record.productId,
                    enabled: record.enabled,
                    stock: record.stock,
                    reserved: record.reserved,
                    createdAt: record.createdAt.toISOString(),
                    updatedAt: record.updatedAt.toISOString(),
                };

                const updated = mutator(current);

                const saved = await tx.tenantInventory.update({
                    where: {
                        tenantId_productId: {
                            tenantId,
                            productId,
                        },
                    },
                    data: {
                        enabled: updated.enabled,
                        stock: updated.stock,
                        reserved: updated.reserved,
                        updatedAt: new Date(updated.updatedAt),
                    },
                });

                return {
                    tenantId: saved.tenantId,
                    productId: saved.productId,
                    enabled: saved.enabled,
                    stock: saved.stock,
                    reserved: saved.reserved,
                    createdAt: saved.createdAt.toISOString(),
                    updatedAt: saved.updatedAt.toISOString(),
                };
            },
            {
                isolationLevel: "Serializable",
            }
        );
    },
};