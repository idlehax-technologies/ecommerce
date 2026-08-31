import type { Cart } from "@/types/cart";
import { prisma } from "@/lib/db/prisma";

export const cartStore = {
    async get(
        tenantId: string,
        userId: string
    ): Promise<Cart> {
        const cart = await prisma.cart.findUnique({
            where: {
                tenantId_userId: {
                    tenantId,
                    userId,
                },
            },
            include: {
                items: true,
            },
        });

        if (!cart) {
            const created = await prisma.cart.create({
                data: {
                    tenantId,
                    userId,
                    updatedAt: new Date(),
                },
            });

            return {
                tenantId: created.tenantId,
                userId: created.userId,
                items: [],
                updatedAt: created.updatedAt.toISOString(),
            };
        }

        return {
            tenantId: cart.tenantId,
            userId: cart.userId,
            items: cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            updatedAt: cart.updatedAt.toISOString(),
        };
    },

    async save(
        cart: Cart
    ): Promise<void> {
        const updatedAt = new Date();

        await prisma.$transaction(
            async (tx) => {
                await tx.cart.upsert({
                    where: {
                        tenantId_userId: {
                            tenantId: cart.tenantId,
                            userId: cart.userId,
                        },
                    },
                    create: {
                        tenantId: cart.tenantId,
                        userId: cart.userId,
                        updatedAt,
                    },
                    update: {
                        updatedAt,
                    },
                });

                await tx.cartItem.deleteMany({
                    where: {
                        tenantId: cart.tenantId,
                        userId: cart.userId,
                    },
                });

                if (cart.items.length > 0) {
                    await tx.cartItem.createMany({
                        data: cart.items.map((item) => ({
                            tenantId: cart.tenantId,
                            userId: cart.userId,
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                    });
                }
            });
    },

    async clear(
        tenantId: string,
        userId: string
    ): Promise<void> {
        await prisma.cart.delete({
            where: {
                tenantId_userId: {
                    tenantId,
                    userId,
                },
            },
        });
    },
};