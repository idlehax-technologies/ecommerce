// lib/checkout/mappers.ts

import type {
    CheckoutRequest,
    CheckoutInput,
} from "@/types/checkout";

export function mapCheckoutDTOToInput(
    dto: CheckoutRequest,
    ctx: { userId: string; tenantId?: string }
): CheckoutInput {
    return {
        userId: ctx.userId,
        tenantId: ctx.tenantId,
        items: dto.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
        })),
    };
}
