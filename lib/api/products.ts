import { apiFetch } from "./fetch";

import type {
    Product,
    CreateProductDTO,
    UpdateProductDTO,
} from "@/types/product";

export async function createProduct(
    body: CreateProductDTO
): Promise<{
    product: Product;
}> {
    return apiFetch<{ product: Product }>(
        "/api/admin/products",
        {
            method: "POST",
            body: JSON.stringify(body),
        }
    );
}

export async function updateProduct(
    productId: string,
    dto: UpdateProductDTO
): Promise<{
    product: Product;
}> {
    return apiFetch<{ product: Product }>(
        `/api/admin/products/${productId}`,
        {
            method: "PATCH",
            body: JSON.stringify(dto),
        }
    );
}