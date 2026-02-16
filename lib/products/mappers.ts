import type {
  Product,
  PublicProduct,
  CreateProductDTO,
  UpdateProductDTO,
  NewProductData,
  ProductChanges,
} from "@/types/product";

import { randomUUID } from "crypto";

function now(): string {
  return new Date().toISOString();
}

/* =========================================================
   Domain creation (tenant already injected by domain)
   ========================================================= */

export function toNewProduct(input: NewProductData): Product {
  return {
    productId: randomUUID(),
    tenantId: input.tenantId,

    title: input.title,
    description: input.description,

    price: input.price,
    currency: "INR",
    stock: input.stock,

    sku: input.sku,
    images: input.images,
    category: input.category,
    tags: input.tags,

    isActive: true,
    isDeleted: false,

    createdAt: now(),
    updatedAt: now(),
  };
}

/* =========================================================
   Client → Domain (tenant intentionally NOT accepted)
   ========================================================= */

export function toCreateProductInput(
  input: CreateProductDTO
): Omit<NewProductData, "tenantId"> {
  return {
    title: input.title,
    description: input.description,
    price: input.price,
    stock: input.stock,
    sku: input.sku,
    images: input.images,
    category: input.category,
    tags: input.tags,
  };
}

export function toUpdateProductPatch(
  patch: UpdateProductDTO
): ProductChanges {
  const safe: ProductChanges = {};

  if (patch.title !== undefined) safe.title = patch.title;
  if (patch.description !== undefined) safe.description = patch.description;
  if (patch.price !== undefined) safe.price = patch.price;
  if (patch.stock !== undefined) safe.stock = patch.stock;
  if (patch.sku !== undefined) safe.sku = patch.sku;
  if (patch.images !== undefined) safe.images = patch.images;
  if (patch.category !== undefined) safe.category = patch.category;
  if (patch.tags !== undefined) safe.tags = patch.tags;

  safe.updatedAt = now();

  return safe;
}

/* =========================================================
   Domain → Public projection
   ========================================================= */

export function toPublicProduct(product: Product): PublicProduct {
  const { tenantId, isDeleted, createdAt, updatedAt, deletedAt, ...rest } =
    product;

  return rest;
}
