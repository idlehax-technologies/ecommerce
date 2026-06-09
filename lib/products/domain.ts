import { productStore } from "./storage";

import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "@/types/product";

import { toNewProduct, toUpdatedProduct } from "./mappers";

import {
  assertActive,
  assertProductExists,
  assertUniqueSku,
} from "./guards";
import { getCategoryCode, ProductCategory } from "./categories";

function now(): string {
  return new Date().toISOString();
}

function getSkuSequence(
  sku: string
): number {
  const [, , sequence] = sku.split("-");

  return Number(sequence);
}

function getNextSkuSequence(
  products: Product[]
): number {
  const maxSequence =
    products
      .map((product) => getSkuSequence(product.sku))
      .reduce((max, current) => Math.max(max, current), 0);

  return maxSequence + 1;
}

function generateSku(
  category: ProductCategory,
  hsnCode: string,
  sequence: number
): string {
  const categoryCode = getCategoryCode(category);

  return `${categoryCode}-${hsnCode.trim()}-${String(sequence).padStart(5, "0")}`;
}

export async function createProduct(
  dto: CreateProductDTO
): Promise<Product> {
  const products = await listProducts();
  const sequence = getNextSkuSequence(products);

  const sku = generateSku(dto.category, dto.hsnCode, sequence);
  assertUniqueSku(products, sku);

  const product = toNewProduct(dto, sku);
  productStore.save(product);

  return product;
}

export async function listProducts(
  limit?: number
): Promise<Product[]> {
  const all = productStore.getAll();

  return limit
    ? all.slice(0, limit)
    : all;
}

export async function listActiveProducts(
  limit?: number
): Promise<Product[]> {
  const active = productStore
    .getAll()
    .filter((p) => p.status === "ACTIVE");

  return limit
    ? active.slice(0, limit)
    : active;
}

export async function getProduct(
  productId: string
): Promise<Product> {
  const p = productStore.get(productId);

  assertProductExists(p);

  return p;
}

export async function getActiveProduct(
  productId: string
): Promise<Product> {
  const p = await getProduct(productId);

  assertActive(p);

  return p;
}

export async function updateProduct(
  productId: string,
  dto: UpdateProductDTO
): Promise<Product> {
  const existing = await getProduct(productId);

  const updated = toUpdatedProduct(existing, dto);

  productStore.save(updated);

  return updated;
}

export async function activateProduct(
  productId: string
): Promise<Product> {
  const existing = await getProduct(productId);

  const updated: Product = {
    ...existing,
    status: "ACTIVE",
    updatedAt: now(),
  };

  productStore.save(updated);

  return updated;
}

export async function deactivateProduct(
  productId: string
): Promise<Product> {
  const existing = await getProduct(productId);

  const updated: Product = {
    ...existing,
    status: "INACTIVE",
    updatedAt: now(),
  };

  productStore.save(updated);

  return updated;
}

export async function getProductForCart(
  productId: string
): Promise<Product> {
  return getActiveProduct(productId);
}