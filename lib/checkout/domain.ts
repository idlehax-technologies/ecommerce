// lib/checkout/domain.ts

import { products } from "@/lib/products/domain";
import type { CheckoutInput } from "@/types/checkout";
import {
    guardProductExists,
    guardStock,
} from "./guards";

export async function processCheckout(input: CheckoutInput) {
    let total = 0;

    // -------------
    // Validate + compute
    // -------------
    for (const item of input.items) {
        const product = guardProductExists(item.productId);

        guardStock(product.stock, item.quantity);

        total += product.price * item.quantity;
    }

    // -------------
    // Reserve stock
    // -------------
    for (const item of input.items) {
        const product = products.get(item.productId)!;
        product.stock -= item.quantity;
        product.updatedAt = new Date().toISOString();
    }

    // -------------
    // Create order id
    // -------------
    const orderId = crypto.randomUUID();

    // Later: persist order here

    return {
        orderId,
        total,
    };
}
