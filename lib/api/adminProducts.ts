// lib/api/adminProducts.ts

import type { Product } from "@/types/product";
import type {
    CreateProductInput,
    UpdateProductPatch,
} from "@/types/product";

const json = { "Content-Type": "application/json" };

async function handle<T>(res: Response): Promise<T> {
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const message =
            typeof data?.error === "string"
                ? data.error
                : "Request failed";

        throw new Error(message);
    }

    return data;
}

/* ======================================================
   ADMIN routes (privileged)
   ====================================================== */

export async function listProducts(): Promise<Product[]> {
    const res = await fetch("/api/admin/products");
    const data = await handle<{ products: Product[] }>(res);
    return data.products;
}

export async function createProduct(
    body: CreateProductInput
): Promise<Product> {
    const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: json,
        body: JSON.stringify(body),
    });

    const data = await handle<{ product: Product }>(res);
    return data.product;
}

export async function getProduct(productId: string): Promise<Product> {
    const res = await fetch(`/api/admin/products/${productId}`);
    const data = await handle<{ product: Product }>(res);
    return data.product;
}

export async function updateProduct(
    productId: string,
    patch: UpdateProductPatch
): Promise<Product> {
    const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: json,
        body: JSON.stringify(patch),
    });

    const data = await handle<{ product: Product }>(res);
    return data.product;
}

export async function deleteProduct(productId: string): Promise<void> {
    const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
    });

    await handle(res);
}
