// lib/products/domain.ts

import { randomUUID } from "crypto";

import type { Product, PublicProduct, DomainCreateInput, DomainUpdatePatch } from "@/types/product";

import { assertTenantCanAccessProduct, assertTenantCanModifyProduct } from "./guards";

import { ProductNotFoundError } from "./errors";


/* =========================================================
   In-memory store (dev only)
   Persist across Next.js hot reloads
   ========================================================= */

const globalForProducts = globalThis as any;

export const products: Map<string, Product> =
  globalForProducts.products ?? new Map();

globalForProducts.products = products;


/* ========================================================= */

function now(): string {
  return new Date().toISOString();
}


/* =========================================================
   Seed
   ========================================================= */

function seed() {
  if (products.size > 0) return;

  const tenantId = "demo-school";

  const samples: Product[] = [
    {
      productId: "p-notebook-001",
      tenantId: "school-a",

      title: "Classmate Notebook (200 pages)",
      description: "Ruled long notebook for daily classwork",

      price: 5000,
      currency: "INR",

      stock: 120,

      isActive: true,
      isDeleted: false,

      sku: "NB-200-A",
      images: ["/images/notebook-200.jpg"],
      category: "Stationery",
      tags: ["notebook", "classroom"],

      createdAt: "2026-02-03T08:00:00.000Z",
      updatedAt: "2026-02-03T08:00:00.000Z"
    },
    {
      productId: "p-geometry-002",
      tenantId: "school-a",

      title: "Geometry Box – Metal",
      description: "Compass, divider, protractor set",

      price: 8500,
      currency: "INR",

      stock: 40,

      isActive: false,
      isDeleted: false,

      sku: "GEO-MET-01",
      images: ["/images/geometry.jpg"],
      category: "Math Tools",
      tags: ["geometry", "math"],

      createdAt: "2026-02-01T10:00:00.000Z",
      updatedAt: "2026-02-03T09:15:00.000Z"
    },
    {
      productId: "p-old-003",
      tenantId: "school-b",

      title: "Old Edition Textbook",
      description: undefined,

      price: 15000,
      currency: "INR",

      stock: 0,

      isActive: false,
      isDeleted: true,

      sku: undefined,
      images: [],
      category: "Books",
      tags: [],

      createdAt: "2025-11-01T07:30:00.000Z",
      updatedAt: "2026-01-15T11:00:00.000Z",
      deletedAt: "2026-01-15T11:00:00.000Z"
    }
  ];

  for (const p of samples) {
    products.set(p.productId, p);
  }
}

seed();


/* =========================================================
   Create
   ========================================================= */

export async function createProduct(
  data: DomainCreateInput
): Promise<Product> {
  const product: Product = {
    productId: randomUUID(),
    tenantId: data.tenantId,

    title: data.title,
    description: data.description,

    price: data.price,
    currency: "INR",
    stock: data.stock,

    sku: data.sku,
    images: data.images,
    category: data.category,
    tags: data.tags,

    isActive: true,
    isDeleted: false,

    createdAt: now(),
    updatedAt: now(),
  };

  products.set(product.productId, product);

  return product;
}


/* =========================================================
   List (tenant scoped)
   ========================================================= */

export async function getTenantProducts(
  tenantId: string,
  includeDeleted = false
): Promise<Product[]> {
  return Array.from(products.values()).filter((p) => {
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
  const product = products.get(productId);

  assertTenantCanAccessProduct(product, tenantId);

  return product!;
}


/* =========================================================
   Update
   ========================================================= */

export async function updateProduct(
  productId: string,
  tenantId: string,
  patch: DomainUpdatePatch
): Promise<Product> {
  const product = products.get(productId);

  assertTenantCanModifyProduct(product, tenantId);

  const updated: Product = {
    ...product!,
    ...patch,
    updatedAt: now(),
  };

  products.set(productId, updated);

  return updated;
}


/* =========================================================
   Soft delete
   ========================================================= */

export async function softDeleteProduct(
  productId: string,
  tenantId: string
): Promise<void> {
  const product = products.get(productId);

  assertTenantCanModifyProduct(product, tenantId);

  products.set(productId, {
    ...product!,
    isDeleted: true,
    isActive: false,
    updatedAt: now(),
  });
}


/* =========================================================
   Public storefront
   ========================================================= */

export async function getAllPublicProducts(): Promise<PublicProduct[]> {
  const result: PublicProduct[] = [];

  for (const p of products.values()) {
    if (p.isDeleted || !p.isActive || p.stock <= 0) continue;

    const { tenantId: _omit, ...safe } = p;
    result.push(safe);
  }

  return result;
}


export async function getPublicProductById(
  productId: string
): Promise<PublicProduct> {
  const p = products.get(productId);

  if (!p || p.isDeleted || !p.isActive || p.stock <= 0) {
    throw new ProductNotFoundError();
  }

  const { tenantId: _omit, ...safe } = p;

  return safe;
}
