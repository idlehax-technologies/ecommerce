import type { PublicProduct } from "@/types/product";

const json = { "Content-Type": "application/json" };
async function handle<T>(res: Response): Promise<T> {
  const data: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    let message = "Request failed";

    if (
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error?: unknown }).error === "string"
    ) {
      message = (data as { error: string }).error;
    }

    throw new Error(message);
  }

  return data as T;
}

export async function listProducts(): Promise<PublicProduct[]> {
  const res = await fetch("/api/products");
  const data = await handle<{ products: PublicProduct[] }>(res);
  return data.products;
}

export async function getProduct(productId: string): Promise<PublicProduct> {
  const res = await fetch(`/api/products/${productId}`);
  const data = await handle<{ product: PublicProduct }>(res);
  return data.product;
}
