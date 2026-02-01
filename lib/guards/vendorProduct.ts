// lib/guards/vendorProduct.ts

import type { Product } from "@/types/product";
import {
  ProductNotFoundError,
  ForbiddenProductError,
  ProductDeletedError,
  ProductInactiveError,
} from "../errors/productErrors";

/*
  =====================================================
  Vendor Product Guards
  =====================================================

  Purpose:
  - Enforce domain invariants
  - Throw domain errors only
  - No side effects
  - No HTTP knowledge
  - No DB access

  Guards answer ONLY:
    "Is this action allowed?"

  If not → throw immediately.
*/

/* =====================================================
   Existence
   ===================================================== */

/**
 * Ensures product exists.
 * Also narrows type for TypeScript.
 */
export function assertProductExists(
  product: Product | null | undefined
): asserts product is Product {
  if (!product) {
    throw new ProductNotFoundError();
  }
}


/* =====================================================
   Ownership
   ===================================================== */

/**
 * Ensures vendor owns this product.
 */
export function assertVendorOwnsProduct(
  product: Product,
  vendorId: string
): void {
  if (product.vendorId !== vendorId) {
    throw new ForbiddenProductError();
  }
}


/* =====================================================
   Lifecycle
   ===================================================== */

/**
 * Ensures product is not soft-deleted.
 */
export function assertNotDeleted(product: Product): void {
  if (product.isDeleted) {
    throw new ProductDeletedError();
  }
}

/**
 * Ensures product is active.
 * (useful for updates/sales but maybe not for viewing)
 */
export function assertActive(product: Product): void {
  if (!product.isActive) {
    throw new ProductInactiveError();
  }
}


/* =====================================================
   Composed helpers (recommended usage)
   ===================================================== */

/**
 * Vendor can view product
 */
export function assertVendorCanAccessProduct(
  product: Product | null | undefined,
  vendorId: string
): asserts product is Product {
  assertProductExists(product);
  assertVendorOwnsProduct(product, vendorId);
  assertNotDeleted(product);
}

/**
 * Vendor can modify product
 */
export function assertVendorCanModifyProduct(
  product: Product | null | undefined,
  vendorId: string
): asserts product is Product {
  assertVendorCanAccessProduct(product, vendorId);
  assertActive(product);
}
