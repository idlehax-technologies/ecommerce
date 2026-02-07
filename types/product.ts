// ============================================
// Core domain model
// ============================================

export type Product = {
  productId: string;          // immutable
  tenantId: string;           // immutable – assigned at creation

  title: string;
  description?: string;

  price: number;              // smallest currency unit (paise)
  currency: "INR";

  stock: number;              // integer >= 0

  isActive: boolean;
  isDeleted: boolean;

  sku?: string;
  images?: string[];
  category?: string;
  tags?: string[];

  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};


// ============================================
// Safe projection for storefront
// (never leak tenant/internal flags)
// ============================================

export type PublicProduct = Omit<
  Product,
  "tenantId" | "isDeleted" | "createdAt" | "updatedAt" | "deletedAt"
>;


// ============================================
// Transport types (client → server)
// ============================================

/**
 * Create product payload (admin form)
 * Client never sends:
 *   - tenantId
 *   - timestamps
 *   - lifecycle flags
 */
export type CreateProductInput = {
  title: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  images?: string[];
  category?: string;
  tags?: string[];
};


export type UpdateProductPatch = {
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  sku?: string;
  images?: string[];
  category?: string;
  tags?: string[];
};


export type DomainCreateInput = {
  tenantId: string;

  title: string;
  description?: string;

  price: number;
  stock: number;

  sku?: string;
  images?: string[];
  category?: string;
  tags?: string[];
};


export type DomainUpdatePatch = Partial<
  Omit<Product, "productId" | "tenantId" | "createdAt">
>;
