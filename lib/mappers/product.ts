// lib/mappers/product.ts

import type { Product } from "@/types/product";
import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "@/types/product.dto.ts"; // adjust paths if separate

/*
  =========================================================
  Product Mappers
  =========================================================

  Purpose:
  - Translate shapes between layers
  - DTO ↔ Domain
  - No validation
  - No guards
  - No side effects

  These are pure functions.
*/

/* =========================================================
   Domain input types
   (domain-friendly shapes, not HTTP shapes)
   ========================================================= */

export type CreateProductInput = CreateProductDTO & {
  vendorId: string;
};

export type DomainUpdatePatch = Partial<
  Omit<Product, "productId" | "vendorId" | "createdAt">
>;


/* =========================================================
   Create
   ========================================================= */

/**
 * Convert request DTO → domain create input
 * Injects vendorId (server-owned field).
 */
export function toCreateProductInput(
  dto: CreateProductDTO,
  vendorId: string
): CreateProductInput {
  return {
    ...dto,
    vendorId,
  };
}


/* =========================================================
   Update
   ========================================================= */

/**
 * Convert update DTO → domain patch
 * Also sets updatedAt automatically.
 *
 * NOTE:
 * No validation here — route already validated.
 */
export function toUpdateProductPatch(
  dto: UpdateProductDTO
): DomainUpdatePatch {
  return {
    ...dto,
    updatedAt: Date.now(),
  };
}


/* =========================================================
   Public projection (optional but useful)
   ========================================================= */

/*
  Sometimes you do NOT want to leak internal fields
  like vendorId, isDeleted, timestamps, etc.

  This creates a safe public shape.
*/

export type PublicProduct = Omit<
  Product,
  "vendorId" | "isDeleted" | "createdAt" | "updatedAt"
>;

/**
 * Domain → public safe projection
 */
export function toPublicProduct(product: Product): PublicProduct {
  const {
    vendorId,
    isDeleted,
    createdAt,
    updatedAt,
    ...rest
  } = product;

  return rest;
}
