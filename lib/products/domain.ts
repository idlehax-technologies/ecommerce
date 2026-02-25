// lib/products/domain.ts

import { productStore } from "./storage";
import type { Product, ProductChanges, CreateProductDTO } from "@/types/product";
import { toNewProduct } from "./mappers";

export async function createProduct(dto: CreateProductDTO): Promise<Product> {
  const product = toNewProduct(dto);
  productStore.save(product);
  return product;
}

export async function listProducts(): Promise<Product[]> {
  return productStore.getAll().filter(p => !p.isDeleted);
}

export async function getProduct(productId: string): Promise<Product> {
  const p = productStore.get(productId);
  if (!p || p.isDeleted) throw new Error("Product not found");
  return p;
}

export async function updateProduct(
  productId: string,
  patch: ProductChanges
): Promise<Product> {
  const existing = await getProduct(productId);

  const updated = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  productStore.save(updated);
  return updated;
}

export async function softDeleteProduct(productId: string): Promise<void> {
  const existing = await getProduct(productId);

  const updated: Product = {
    ...existing,
    isDeleted: true,
    isActive: false,
    updatedAt: new Date().toISOString(),
  };

  productStore.save(updated);
}

export async function getProductForCart(productId: string): Promise<Product> {
  const p = productStore.get(productId);
  if (!p || p.isDeleted) throw new Error("Product not found");
  return p;
}