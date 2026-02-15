import type { Product, PublicProduct, DomainCreateInput, DomainUpdatePatch } from "@/types/product";

import { productStore } from "./storage";

import {
  assertInStock,
  assertTenantCanAccessProduct,
  assertTenantCanModifyProduct,
} from "./guards";

import { toNewProduct, toPublicProduct } from "./mappers";

/* =========================================================
   Create
   ========================================================= */

export async function createProduct(input: DomainCreateInput): Promise<Product> {
  const product = toNewProduct(input);

  productStore.save(product);

  return product;
}

/* =========================================================
   Tenant list
   ========================================================= */

export async function getTenantProducts(
  tenantId: string,
  includeDeleted = false
): Promise<Product[]> {
  return productStore.getAll().filter(p => {
    if (p.tenantId !== tenantId) return false;
    if (!includeDeleted && p.isDeleted) return false;
    return true;
  });
}

/* =========================================================
   Get single
   ========================================================= */

export async function getProductById(
  productId: string,
  tenantId: string
): Promise<Product> {
  const product = productStore.get(productId);

  assertTenantCanAccessProduct(product, tenantId);

  return product;
}

/* =========================================================
   Update
   ========================================================= */

export async function updateProduct(
  productId: string,
  tenantId: string,
  patch: DomainUpdatePatch
): Promise<Product> {
  const product = productStore.get(productId);

  assertTenantCanModifyProduct(product, tenantId);

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
  productId: string,
  tenantId: string
): Promise<void> {
  const product = productStore.get(productId);

  assertTenantCanModifyProduct(product, tenantId);

  productStore.save({
    ...product,
    isDeleted: true,
    isActive: false,
    updatedAt: new Date().toISOString(),
  });
}

/* =========================================================
   Public storefront
   ========================================================= */

export async function getAllPublicProducts(): Promise<PublicProduct[]> {
  return productStore
    .getAll()
    .filter(p => !p.isDeleted && p.isActive && p.stock > 0)
    .map(toPublicProduct);
}

export async function getPublicProductById(productId: string): Promise<PublicProduct> {
  const product = productStore.get(productId);

  assertTenantCanAccessProduct(product, product?.tenantId ?? "");
  assertInStock(product);

  return toPublicProduct(product);
}