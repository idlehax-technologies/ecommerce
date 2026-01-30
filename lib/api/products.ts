import type { PublicProduct } from "@/types/product";

export async function listProducts(): Promise<PublicProduct[]> {
  const res = await fetch("/api/products");

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  return data.products;
}

export async function getProduct(productId: string): Promise<PublicProduct | null> {
  const res = await fetch(`/api/products/${productId}`);

  if (!res.ok) {
    throw new Error("Product not found");
  }

  const data = await res.json();
  return data.product;
}
