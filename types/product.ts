export type Product = {
  productId: string;
  tenantId: string;

  title: string;
  description?: string;

  price: number;
  currency: "INR";

  stock: number;

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

export type PublicProduct = Omit<
  Product,
  "tenantId" | "isDeleted" | "createdAt" | "updatedAt" | "deletedAt"
>;

export type CreateProductDTO = {
  title: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  images?: string[];
  category?: string;
  tags?: string[];
};

export type UpdateProductDTO = {
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  sku?: string;
  images?: string[];
  category?: string;
  tags?: string[];
};

/**
 * Internal-only seed used by domain AFTER tenant is injected.
 */
export type NewProductData = CreateProductDTO & {
  tenantId: string;
};

export type ProductChanges = Partial<
  Omit<Product, "productId" | "tenantId" | "createdAt">
>;
