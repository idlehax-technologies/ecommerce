import type { CheckoutInput, CheckoutRequest } from "@/types/checkout";

export function toCheckoutInput(
    userId: string,
    tenantId: string,
    req: CheckoutRequest
): CheckoutInput {
    return {
        userId,
        tenantId,
        items: req.items,
    };
}