import { randomUUID } from "crypto";
import type { Product, PublicProduct } from "@/types/product";

// --------------------------------------------------
// In-memory store (persistence abstraction)
// --------------------------------------------------

const products = new Map<string, Product>();

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function now(): string {
  return new Date().toISOString();
}

// --------------------------------------------------
// Create
// --------------------------------------------------

export async function createProduct(data: {
  vendorId: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  images?: string[];
  category?: string;
  tags?: string[];
}): Promise<Product> {
  const product: Product = {
    productId: randomUUID(),
    vendorId: data.vendorId,

    title: data.title,
    description: data.description,

    price: data.price,
    currency: "INR",
    stock: data.stock,

    isActive: true,
    isDeleted: false,

    sku: data.sku,
    images: data.images,
    category: data.category,
    tags: data.tags,

    createdAt: now(),
    updatedAt: now(),
  };

  products.set(product.productId, product);
  return product;
}

// --------------------------------------------------
// List (vendor-scoped)
// --------------------------------------------------

export async function getVendorProducts(
  vendorId: string,
  includeDeleted = false
): Promise<Product[]> {
  return Array.from(products.values()).filter((p) => {
    if (p.vendorId !== vendorId) return false;
    if (!includeDeleted && p.isDeleted) return false;
    return true;
  });
}

// --------------------------------------------------
// Get single (vendor-scoped)
// --------------------------------------------------

export async function getProductById(
  productId: string,
  vendorId: string
): Promise<Product | null> {
  const product = products.get(productId);
  if (!product) return null;
  if (product.vendorId !== vendorId) return null;
  return product;
}

// --------------------------------------------------
// Update (vendor-scoped, partial)
// --------------------------------------------------

export async function updateProduct(
  productId: string,
  vendorId: string,
  patch: Partial<Omit<Product, "productId" | "vendorId" | "createdAt">>
): Promise<Product | null> {
  const product = products.get(productId);
  if (!product) return null;
  if (product.vendorId !== vendorId) return null;
  if (product.isDeleted) return null;

  const updated: Product = {
    ...product,
    ...patch,
    updatedAt: now(),
  };

  products.set(productId, updated);
  return updated;
}

// --------------------------------------------------
// Soft delete (vendor-scoped)
// --------------------------------------------------

export async function softDeleteProduct(
  productId: string,
  vendorId: string
): Promise<boolean> {
  const product = products.get(productId);
  if (!product) return false;
  if (product.vendorId !== vendorId) return false;
  if (product.isDeleted) return false;

  products.set(productId, {
    ...product,
    isDeleted: true,
    isActive: false,
    deletedAt: now(),
    updatedAt: now(),
  });

  return true;
}



/*
|--------------------------------------------------------------------------
| Public storefront (READ-ONLY — cross-vendor)
|--------------------------------------------------------------------------
| These are PUBLIC SAFE PROJECTIONS.
| They NEVER expose vendorId or deleted/inactive products.
| Used by /api/products/*
|--------------------------------------------------------------------------
*/


export async function getAllPublicProducts(): Promise<PublicProduct[]> {
  const result: PublicProduct[] = [];

  for (const p of products.values()) {
    if (p.isDeleted) continue;
    if (!p.isActive) continue;
    if (p.stock <= 0) continue;

    const { vendorId: _omit, ...safe } = p;
    result.push(safe);
  }

  return result;
}


export async function getPublicProductById(
  productId: string
): Promise<PublicProduct | null> {
  const p = products.get(productId);
  if (!p) return null;

  if (p.isDeleted) return null;
  if (!p.isActive) return null;
  if (p.stock <= 0) return null;

  const { vendorId: _omit, ...safe } = p;
  return safe;
}
