import { productStore } from "./storage";
import type {
  Product,
  ProductChanges,
  CreateProductDTO,
} from "@/types/product";

import { toNewProduct } from "./mappers";
import { assertNotDeleted, assertProductExists } from "./guards";

function now(): string {
  return new Date().toISOString();
}

export async function createProduct(
  dto: CreateProductDTO
): Promise<Product> {
  const product = toNewProduct(dto);
  productStore.save(product);
  return product;
}

export async function listProducts(): Promise<Product[]> {
  return productStore.getAll().filter(p => !p.deletedAt);
}

export async function getProduct(productId: string): Promise<Product> {
  const p = productStore.get(productId);
  assertProductExists(p);
  assertNotDeleted(p);

  return p;
}

export async function updateProduct(
  productId: string,
  changes: ProductChanges
): Promise<Product> {
  const existing = await getProduct(productId);

  const updated: Product = {
    ...existing,
    ...changes,
  };

  productStore.save(updated);
  return updated;
}

export async function softDeleteProduct(
  productId: string
): Promise<void> {
  const existing = await getProduct(productId);

  const updated: Product = {
    ...existing,
    deletedAt: now(),
    isActive: false,
    updatedAt: now(),
  };

  productStore.save(updated);
}

export async function getProductForCart(productId: string): Promise<Product> {
  const p = productStore.get(productId);
  assertProductExists(p);
  assertNotDeleted(p);

  return p;
}