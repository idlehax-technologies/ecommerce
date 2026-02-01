import type { Product } from "@/types/product";
import type {
    CreateProductDTO,
    UpdateProductDTO,
} from "@/types/product.dto";

const json = { "Content-Type": "application/json" };


/* ======================================================
   Small helper
   ====================================================== */

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
   Vendor Products API wrappers
   ====================================================== */

export async function listVendorProducts(): Promise<Product[]> {
    const res = await fetch("/api/vendor/products");

    const data = await handle<{ products: Product[] }>(res);

    return data.products;
}


export async function createVendorProduct(
    body: CreateProductDTO
): Promise<Product> {
    const res = await fetch("/api/vendor/products", {
        method: "POST",
        headers: json,
        body: JSON.stringify(body),
    });

    const data = await handle<{ product: Product }>(res);

    return data.product;
}


export async function getVendorProduct(
    productId: string
): Promise<Product> {
    const res = await fetch(`/api/vendor/products/${productId}`);

    const data = await handle<{ product: Product }>(res);

    return data.product;
}


export async function updateVendorProduct(
    productId: string,
    patch: UpdateProductDTO
): Promise<Product> {
    const res = await fetch(`/api/vendor/products/${productId}`, {
        method: "PATCH",
        headers: json,
        body: JSON.stringify(patch),
    });

    const data = await handle<{ product: Product }>(res);

    return data.product;
}


export async function deleteVendorProduct(
    productId: string
): Promise<void> {
    const res = await fetch(`/api/vendor/products/${productId}`, {
        method: "DELETE",
    });

    await handle(res);
}
