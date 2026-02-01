import { randomUUID } from "crypto";
import type { Product, PublicProduct } from "@/types/product";
import { CreateProductDTO } from "@/types/product.dto";

// --------------------------------------------------
// In-memory store (persistence abstraction)
// --------------------------------------------------

// const products = new Map<string, Product>();
const globalForProducts = globalThis as any;

export const products: Map<string, Product> =
  globalForProducts.products ?? new Map();

globalForProducts.products = products;

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function now(): string {
  return new Date().toISOString();
}

// --------------------------------------------------
// Dummy Data
// --------------------------------------------------

function seed() {
  const vendorId = "demo-vendor"; // must match a vendor in auth

  const samples: Product[] = [
    {
      productId: "p-1",
      vendorId,
      title: "Mechanical Keyboard",
      description: "Hot-swappable, brown switches",
      price: 499900,
      currency: "INR",
      stock: 12,
      sku: "KEY-MECH-001",
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
      ],
      category: "Peripherals",
      tags: ["keyboard", "mechanical", "gaming", "rgb"],
      isActive: true,
      isDeleted: false,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      productId: "p-2",
      vendorId,
      title: "Wireless Mouse",
      description: "2.4GHz ergonomic",
      price: 129900,
      currency: "INR",
      stock: 30,
      sku: "MOU-WL-002",
      images: [
        "https://images.unsplash.com/photo-1527814050087-3793815479db",
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
      ],
      category: "Accessories",
      tags: ["mouse", "wireless", "ergonomic", "office"],
      isActive: true,
      isDeleted: false,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      productId: "p-3",
      vendorId,
      title: "USB-C Hub",
      description: "HDMI + USB 3.0 + PD",
      price: 219900,
      currency: "INR",
      stock: 7,
      sku: "HUB-USBC-003",
      images: [
        "https://images.unsplash.com/photo-1580894894513-541e068a3e2b",
        "https://images.unsplash.com/photo-1609592806787-3d9a2aefbe6f",
      ],
      category: "Connectivity",
      tags: ["usb-c", "hub", "adapter", "laptop"],
      isActive: true,
      isDeleted: false,
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  for (const p of samples) {
    products.set(p.productId, p);
  }
}

seed();

// --------------------------------------------------
// Create
// --------------------------------------------------

type CreateProductInput = CreateProductDTO & {
  vendorId: string;
};

export async function createProduct(data: CreateProductInput): Promise<Product> {
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

type DomainUpdatePatch = Partial<Omit<Product, "productId" | "vendorId" | "createdAt">>;

export async function updateProduct(
  productId: string,
  vendorId: string,
  patch: DomainUpdatePatch
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
