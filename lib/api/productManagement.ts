import { apiFetch } from "./fetch";
import type { Product, CreateProductDTO, UpdateProductDTO } from "@/types/product";

export async function listProducts(): Promise<Product[]> {
    const data = await apiFetch<{ products: Product[] }>("/api/admin/products");
    return data.products;
}

export async function createProduct(body: CreateProductDTO): Promise<Product> {
    const data = await apiFetch<{ product: Product }>("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(body),
    });
    return data.product;
}

export async function getProduct(productId: string): Promise<Product> {
    const data = await apiFetch<{ product: Product }>(`/api/admin/products/${productId}`);
    return data.product;
}

export async function updateProduct(
    productId: string,
    patch: UpdateProductDTO
): Promise<Product> {
    const data = await apiFetch<{ product: Product }>(
        `/api/admin/products/${productId}`,
        {
            method: "PATCH",
            body: JSON.stringify(patch),
        }
    );
    return data.product;
}

export async function deleteProduct(productId: string): Promise<void> {
    await apiFetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
    });
}