export type Product = {
  productId: string;

  title: string;
  description?: string;

  price: number;
  currency: "INR";

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
  "isDeleted" | "createdAt" | "updatedAt" | "deletedAt"
>;

export type CreateProductDTO = {
  title: string;
  description?: string;
  price: number;
  sku?: string;
  images?: string[];
  category?: string;
  tags?: string[];
};

export type UpdateProductDTO = Partial<CreateProductDTO>;

export type ProductChanges = Partial<
  Omit<Product, "productId" | "createdAt">
>;
