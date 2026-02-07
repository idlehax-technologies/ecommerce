// lib/products/guards.ts

import type { Product } from "@/types/product";
import {
  ProductNotFoundError,
  ForbiddenProductError,
  ProductDeletedError,
  ProductInactiveError,
} from "./errors";

export function assertProductExists(
  p: Product | null | undefined
): asserts p is Product {
  if (!p) throw new ProductNotFoundError();
}

export function assertTenantOwnsProduct(p: Product, tenantId: string) {
  if (p.tenantId !== tenantId) throw new ForbiddenProductError();
}

export function assertNotDeleted(p: Product) {
  if (p.isDeleted) throw new ProductDeletedError();
}

export function assertActive(p: Product) {
  if (!p.isActive) throw new ProductInactiveError();
}

export function assertTenantCanAccessProduct(
  p: Product | null | undefined,
  tenantId: string
): asserts p is Product {
  assertProductExists(p);
  assertTenantOwnsProduct(p, tenantId);
  assertNotDeleted(p);
}

export function assertTenantCanModifyProduct(
  p: Product | null | undefined,
  tenantId: string
): asserts p is Product {
  assertTenantCanAccessProduct(p, tenantId);
  assertActive(p);
}
