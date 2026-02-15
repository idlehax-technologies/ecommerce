// lib/checkout/mappers.ts

import type {
    CheckoutRequest,
    CheckoutInput,
} from "@/types/checkout";

import crypto from "crypto";
import type { Order, OrderItem } from "@/types/order";
import type { Product } from "@/types/product";

export function toOrderItemSnapshot(
    product: Product,
    quantity: number
): OrderItem {
    return {
        productId: product.productId,
        name: product.title,
        price: product.price,
        quantity
    };
}

export function toNewOrder(
    userId: string,
    tenantId: string,
    items: OrderItem[],
    total: number
): Order {
    const now = new Date().toISOString();

    return {
        orderId: crypto.randomUUID(),
        tenantId,
        userId,
        items,
        total,
        currency: "INR",
        paymentMode: "CASH",
        status: "RESERVED",
        createdAt: now,
        updatedAt: now
    };
}

export function mapCheckoutDTOToInput(
    dto: CheckoutRequest,
    ctx: { userId: string; tenantId: string }
): CheckoutInput {
    return {
        userId: ctx.userId,
        tenantId: ctx.tenantId,
        items: dto.items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
        })),
    };
}
