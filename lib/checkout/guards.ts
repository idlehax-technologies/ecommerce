// lib/checkout/guards.ts

import { products } from "@/lib/products/domain";
import {
    ProductNotFoundError,
    OutOfStockError,
} from "./errors";

export function guardProductExists(productId: string) {
    const product = products.get(productId);

    if (!product || product.isDeleted || !product.isActive) {
        throw new ProductNotFoundError();
    }

    return product;
}

export function guardStock(stock: number, qty: number) {
    if (stock < qty) {
        throw new OutOfStockError();
    }
}
