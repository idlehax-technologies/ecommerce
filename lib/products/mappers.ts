// lib/products/mappers.ts

import type {
  Product,
  PublicProduct,
  CreateProductInput,
  UpdateProductPatch,
  DomainCreateInput,
  DomainUpdatePatch,
} from "@/types/product";
import { randomUUID } from "crypto";


// ============================================================
// helpers
// ============================================================

function now(): string {
  return new Date().toISOString();
}


export function toNewProduct(input: DomainCreateInput): Product {
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


/**
 * Client CreateProductInput → DomainCreateInput
 *
 * Adds tenantId only.
 * Explicit mapping (no spreading).
 * Domain will generate:
 *   - productId
 *   - timestamps
 *   - flags
 */
export function toCreateProductInput(
  input: CreateProductInput,
  tenantId: string
): DomainCreateInput {
  return {
    tenantId,

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


/**
 * Client UpdateProductPatch → DomainUpdatePatch
 *
 * Explicit + safe:
 *   - only copy defined fields
 *   - prevent undefined overwrite bugs
 */
export function toUpdateProductPatch(
  patch: UpdateProductPatch
): DomainUpdatePatch {
  const safePatch: DomainUpdatePatch = {};

  if (patch.title !== undefined) safePatch.title = patch.title;
  if (patch.description !== undefined) safePatch.description = patch.description;
  if (patch.price !== undefined) safePatch.price = patch.price;
  if (patch.stock !== undefined) safePatch.stock = patch.stock;
  if (patch.sku !== undefined) safePatch.sku = patch.sku;
  if (patch.images !== undefined) safePatch.images = patch.images;
  if (patch.category !== undefined) safePatch.category = patch.category;
  if (patch.tags !== undefined) safePatch.tags = patch.tags;

  // domain also sets updatedAt,
  // but harmless if included here too
  safePatch.updatedAt = now();

  return safePatch;
}


// ============================================================
// Domain → Public projection
// ============================================================

/**
 * Strip private/internal fields
 */
export function toPublicProduct(product: Product): PublicProduct {
  const {
    tenantId,
    isDeleted,
    createdAt,
    updatedAt,
    deletedAt,
    ...rest
  } = product;

  return rest;
}
