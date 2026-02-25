export type Product = {
  productId: string;

  title: string;
  description?: string;

  price: number;
  currency: "INR";

  isActive: boolean;

  sku?: string;
  images?: string[];
  category?: string;
  tags?: string[];

  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // single source of deletion truth
};

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

export type ProductChanges = {
  title?: string;
  description?: string;
  price?: number;
  sku?: string;
  images?: string[];
  category?: string;
  tags?: string[];

  updatedAt: string;
};