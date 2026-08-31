import type { Order, OrderStatus } from "@/types/order";
import type { PaymentMethod } from "@/types/payment";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "../generated/prisma/client";

/**
 * Map Prisma Order aggregate → domain Order.
 */
function toOrder(
    order: {
        orderId: string;
        orderNumber: string;
        tenantId: string;
        userId: string;
        placedByStaffId: string | null;
        total: number;
        currency: string;
        paymentMethod: PaymentMethod | null;
        invoiceNumber: string | null;
        invoiceIssuedAt: Date | null;
        status: OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        sellerSnapshot: {
            name: string;
            address: string;
            state: string;
            gstin: string | null;
        } | null;
        customerSnapshot: {
            fullName: string;
            phone: string;
            email: string;
            addressText: string;
        } | null;
        itemSnapshots: {
            productId: string;
            sku: string;
            title: string;
            description: string;
            price: number;
            discountPercent: number;
            hsnCode: string;
            gstRate: Prisma.Decimal;
            quantity: number;
        }[];
    }
): Order {

    if (
        !order.sellerSnapshot ||
        !order.customerSnapshot ||
        order.itemSnapshots.length === 0
    ) {
        throw new Error(
            `Order ${order.orderId} is missing required snapshots`
        );
    }

    return {
        orderId: order.orderId,
        orderNumber: order.orderNumber,

        tenantId: order.tenantId,
        userId: order.userId,

        seller: {
            name: order.sellerSnapshot.name,
            address: order.sellerSnapshot.address,
            state: order.sellerSnapshot.state as Order["seller"]["state"],
            ...(order.sellerSnapshot.gstin !== null
                ? {
                    gstin: order.sellerSnapshot.gstin,
                }
                : {}),
        },

        customer: {
            fullName: order.customerSnapshot.fullName,
            phone: order.customerSnapshot.phone,
            email: order.customerSnapshot.email,
            addressText: order.customerSnapshot.addressText,
        },

        ...(order.placedByStaffId !== null
            ? {
                placedByStaffId: order.placedByStaffId,
            }
            : {}),

        items: order.itemSnapshots.map((item) => ({
            productId: item.productId,
            sku: item.sku,
            title: item.title,
            description: item.description,
            price: item.price,
            discountPercent: item.discountPercent,
            hsnCode: item.hsnCode,
            gstRate: Number(item.gstRate) as Order["items"][number]["gstRate"],
            quantity: item.quantity,
        })),

        total: order.total,
        currency: order.currency as "INR",

        ...(order.paymentMethod !== null
            ? {
                paymentMethod: order.paymentMethod,
            }
            : {}),

        ...(order.invoiceNumber !== null
            ? {
                invoiceNumber: order.invoiceNumber,
            }
            : {}),

        ...(order.invoiceIssuedAt !== null
            ? {
                invoiceIssuedAt:
                    order.invoiceIssuedAt.toISOString(),
            }
            : {}),

        status: order.status,

        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
    };
}

export const orderStore = {

    /**
     * Save the complete Order aggregate.
     *
     * The Order, seller snapshot, customer snapshot,
     * and item snapshots are persisted together.
     */
    async save(
        order: Order
    ): Promise<void> {

        await prisma.order.upsert({
            where: {
                orderId: order.orderId,
            },

            create: {
                orderId: order.orderId,
                orderNumber: order.orderNumber,

                tenantId: order.tenantId,
                userId: order.userId,
                placedByStaffId:
                    order.placedByStaffId ?? null,

                total: order.total,
                currency: order.currency,

                paymentMethod:
                    order.paymentMethod ?? null,

                invoiceNumber:
                    order.invoiceNumber ?? null,

                invoiceIssuedAt:
                    order.invoiceIssuedAt
                        ? new Date(order.invoiceIssuedAt)
                        : null,

                status: order.status,

                createdAt:
                    new Date(order.createdAt),

                updatedAt:
                    new Date(order.updatedAt),

                sellerSnapshot: {
                    create: {
                        name: order.seller.name,
                        address: order.seller.address,
                        state: order.seller.state,
                        gstin:
                            order.seller.gstin ??
                            null,
                    },
                },

                customerSnapshot: {
                    create: {
                        fullName:
                            order.customer.fullName,
                        phone:
                            order.customer.phone,
                        email:
                            order.customer.email,
                        addressText:
                            order.customer.addressText,
                    },
                },

                itemSnapshots: {
                    create: order.items.map((item) => ({
                        productId: item.productId,
                        sku: item.sku,
                        title: item.title,
                        description: item.description,
                        price: item.price,
                        discountPercent:
                            item.discountPercent,
                        hsnCode: item.hsnCode,
                        gstRate: item.gstRate,
                        quantity: item.quantity,
                    })),
                },
            },

            update: {
                paymentMethod:
                    order.paymentMethod ?? null,

                invoiceNumber:
                    order.invoiceNumber ?? null,

                invoiceIssuedAt:
                    order.invoiceIssuedAt
                        ? new Date(order.invoiceIssuedAt)
                        : null,

                status: order.status,

                updatedAt:
                    new Date(order.updatedAt),
            },
        });
    },

    /**
     * Retrieve an Order aggregate by ID.
     */
    async get(
        orderId: string
    ): Promise<Order | undefined> {

        const order =
            await prisma.order.findUnique({
                where: {
                    orderId,
                },
                include: {
                    sellerSnapshot: true,
                    customerSnapshot: true,
                    itemSnapshots: true,
                },
            });

        if (!order) {
            return undefined;
        }

        return toOrder(order);
    },

    /**
     * List all Orders.
     */
    async listAll(): Promise<Order[]> {

        const orders =
            await prisma.order.findMany({
                include: {
                    sellerSnapshot: true,
                    customerSnapshot: true,
                    itemSnapshots: true,
                },
            });

        return orders.map(toOrder);
    },

    /**
     * List Orders belonging to a tenant.
     */
    async listByTenant(
        tenantId: string
    ): Promise<Order[]> {

        const orders =
            await prisma.order.findMany({
                where: {
                    tenantId,
                },
                include: {
                    sellerSnapshot: true,
                    customerSnapshot: true,
                    itemSnapshots: true,
                },
            });

        return orders.map(toOrder);
    },
};