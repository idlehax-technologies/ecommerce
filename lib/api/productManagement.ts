import { apiFetch } from "./fetch";

import type {
    Product,
    CreateProductDTO,
    UpdateProductDTO,
} from "@/types/product";

export async function listProducts(): Promise<{
    products: Product[];
}> {
    return apiFetch<{ products: Product[] }>(
        "/api/admin/products"
    );
}

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

export async function getProduct(
    productId: string
): Promise<{
    product: Product;
}> {
    return apiFetch<{ product: Product }>(
        `/api/admin/products/${productId}`
    );
}

export async function updateProduct(
    productId: string,
    patch: UpdateProductDTO
): Promise<{
    product: Product;
}> {
    return apiFetch<{ product: Product }>(
        `/api/admin/products/${productId}`,
        {
            method: "PATCH",
            body: JSON.stringify(patch),
        }
    );
}

export async function deleteProduct(
    productId: string
): Promise<{
    success: true;
}> {
    return apiFetch<{ success: true }>(
        `/api/admin/products/${productId}`,
        {
            method: "DELETE",
        }
    );
}