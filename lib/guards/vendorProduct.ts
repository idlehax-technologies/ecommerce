// lib/guards/vendorProduct.ts

import type { Product } from "@/types/product";
import { productErrors } from "@/lib/errors/productErrors";

/**
 * Guard: ensure product exists.
 */
export function assertProductExists(
  product: Product | null | undefined
): asserts product is Product {
  if (!product) throw productErrors.notFound();
}

/**
 * Guard: ensure product belongs to the vendor.
 */
export function assertVendorOwnsProduct(product: Product, vendorId: string) {
  if (product.vendorId !== vendorId) throw productErrors.forbidden();
}

/**
 * Guard: ensure product is not deleted.
 */
export function assertProductNotDeleted(product: Product) {
  if (product.isDeleted) throw productErrors.deleted();
}
