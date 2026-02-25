// lib/products/guards.ts

import type { Product } from "@/types/product";
import {
  ProductNotFoundError,
  ProductDeletedError,
  ProductInactiveError,
} from "./errors";

export function assertProductExists(
  p: Product | null | undefined
): asserts p is Product {
  if (!p) throw new ProductNotFoundError();
}

export function assertNotDeleted(p: Product) {
  if (p.deletedAt) throw new ProductDeletedError();
}

export function assertActive(p: Product) {
  if (!p.isActive) throw new ProductInactiveError();
}