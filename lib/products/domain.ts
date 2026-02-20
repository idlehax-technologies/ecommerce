import type {
  Product,
  PublicProduct,
  NewProductData,
  ProductChanges,
} from "@/types/product";

import type { TenantScopedActor } from "@/types/tenant";

import { productStore } from "./storage";

import {
  assertInStock,
  assertTenantCanAccessProduct,
  assertTenantCanModifyProduct,
} from "./guards";

import { toNewProduct, toPublicProduct } from "./mappers";

/* =========================================================
   Create (tenant derived from actor — never from input)
   ========================================================= */

export async function createProduct(
  actor: TenantScopedActor,
  input: Omit<NewProductData, "tenantId">
): Promise<Product> {
  const product = toNewProduct({
    ...input,
    tenantId: actor.tenantId,
  });

  productStore.save(product);
  return product;
}

/* =========================================================
   Tenant list
   ========================================================= */

export async function listProducts(
  actor: TenantScopedActor,
  includeDeleted = false
): Promise<Product[]> {
  return productStore.getAll().filter(p => {
    if (p.tenantId !== actor.tenantId) return false;
    if (!includeDeleted && p.isDeleted) return false;
    return true;
  });
}

/* =========================================================
   Get single
   ========================================================= */

export async function getProduct(
  actor: TenantScopedActor,
  productId: string
): Promise<Product> {
  const product = productStore.get(productId);
  assertTenantCanAccessProduct(product, actor.tenantId);
  return product;
}


/* =========================================================
   Read-only access for dependent domains (Cart / Checkout)
   This intentionally exposes a minimal validation surface.
   ========================================================= */

export async function getProductForCart(
  actor: TenantScopedActor,
  productId: string
): Promise<Product> {
  // Reuse the same guarded access path.
  // Cart must not bypass product invariants.
  const product = productStore.get(productId);

  assertTenantCanAccessProduct(product, actor.tenantId);

  // NOTE:
  // We do NOT check stock or activity here.
  // Cart is allowed to hold intent; checkout will enforce availability.
  return product;
}


/* =========================================================
   Update
   ========================================================= */

export async function updateProduct(
  actor: TenantScopedActor,
  productId: string,
  patch: ProductChanges
): Promise<Product> {
  const product = productStore.get(productId);
  assertTenantCanModifyProduct(product, actor.tenantId);

  const updated: Product = {
    ...product,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  productStore.save(updated);
  return updated;
}

/* =========================================================
   Soft delete
   ========================================================= */

export async function softDeleteProduct(
  actor: TenantScopedActor,
  productId: string
): Promise<void> {
  const product = productStore.get(productId);
  assertTenantCanModifyProduct(product, actor.tenantId);

  productStore.save({
    ...product,
    isDeleted: true,
    isActive: false,
    updatedAt: new Date().toISOString(),
  });
}

/* =========================================================
   Public storefront (still tenant-scoped!)
   ========================================================= */

export async function listPublicProducts(
  actor: TenantScopedActor
): Promise<PublicProduct[]> {
  return productStore
    .getAll()
    .filter(
      p =>
        p.tenantId === actor.tenantId &&
        !p.isDeleted &&
        p.isActive &&
        p.stock > 0
    )
    .map(toPublicProduct);
}

export async function getPublicProduct(
  actor: TenantScopedActor,
  productId: string
): Promise<PublicProduct> {
  const product = productStore.get(productId);

  assertTenantCanAccessProduct(product, actor.tenantId);
  assertInStock(product);

  return toPublicProduct(product);
}
