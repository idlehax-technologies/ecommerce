import type { Product } from "@/types/product";

const json = { "Content-Type": "application/json" };

export async function listVendorProducts(): Promise<Product[]> {
    const res = await fetch("/api/vendor/products");
    if (!res.ok) throw new Error("Failed to list products");
    return (await res.json()).products;
}

export async function createVendorProduct(body: unknown): Promise<Product> {
    const res = await fetch("/api/vendor/products", {
        method: "POST",
        headers: json,
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return (await res.json()).product;
}

export async function getVendorProduct(productId: string): Promise<Product> {
    const res = await fetch(`/api/vendor/products/${productId}`);
    if (!res.ok) throw new Error("Product not found");
    return (await res.json()).product;
}

export async function updateVendorProduct(
    productId: string,
    patch: unknown
): Promise<Product> {
    const res = await fetch(`/api/vendor/products/${productId}`, {
        method: "PATCH",
        headers: json,
        body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return (await res.json()).product;
}

export async function deleteVendorProduct(productId: string): Promise<void> {
    const res = await fetch(`/api/vendor/products/${productId}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete product");
}
