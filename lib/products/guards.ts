import type { Product } from "@/types/product";

import {
  ProductNotFoundError,
  ProductInactiveError,
  ProductSkuAlreadyExistsError,
} from "./errors";

export function assertProductExists(
  p: Product | null | undefined
): asserts p is Product {
  if (!p) throw new ProductNotFoundError();
}

export function assertActive(p: Product): void {
  if (p.status !== "ACTIVE") {
    throw new ProductInactiveError();
  }
}

export function assertUniqueSku(
  products: Product[],
  sku: string
): void {
  const exists = products.some((p) => p.sku === sku);

  if (exists) {
    throw new ProductSkuAlreadyExistsError();
  }
}