import type { CheckoutInput } from "@/types/checkout";
import { orderStore } from "./storage";
import { assertOrderableProduct, assertSufficientStock } from "./guards";
import { toOrderItemSnapshot, toNewOrder } from "./mappers";

export async function processCheckout(input: CheckoutInput) {
    if (!input.tenantId) {
        throw new Error("Tenant context required");
    }

    const snapshots = [];
    let total = 0;

    // Phase 1 — validate and compute
    for (const item of input.items) {
        const product = await assertOrderableProduct(
            item.productId,
            input.tenantId
        );

        assertSufficientStock(product.stock, item.quantity);

        const snapshot = toOrderItemSnapshot(product, item.quantity);
        snapshots.push(snapshot);

        total += snapshot.price * snapshot.quantity;
    }

    // Phase 2 — commit mutation
    for (const item of input.items) {
        const product = await assertOrderableProduct(
            item.productId,
            input.tenantId
        );

        product.stock -= item.quantity;
        product.updatedAt = new Date().toISOString();
    }

    const order = toNewOrder(input.userId, input.tenantId, snapshots, total);

    orderStore.save(order);

    return order;
}
