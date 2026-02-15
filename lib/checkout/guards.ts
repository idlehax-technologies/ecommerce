import { getProductById } from "@/lib/products/domain";
import type { Product } from "@/types/product";
import { OrderItemNotFoundError, ProductOutOfStockError } from "./errors";

export async function assertOrderableProduct(
    productId: string,
    tenantId: string
): Promise<Product> {
    const product = await getProductById(productId, tenantId);

    if (!product.isActive || product.isDeleted) {
        throw new OrderItemNotFoundError();
    }

    return product;
}

export function assertSufficientStock(stock: number, quantity: number) {
    if (stock < quantity) {
        throw new ProductOutOfStockError();
    }
}
