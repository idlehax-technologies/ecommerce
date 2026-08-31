import { GstRate } from "@/lib/products/gst";
import type { ProductCategory } from "@/lib/products/categories";

export type ProductStatus =
  | "ACTIVE"
  | "INACTIVE";

export type Product = {
  productId: string;
  sku: string;

  title: string;
  description: string;

  price: number;
  discountPercent: number;
  currency: "INR";

  hsnCode: string;
  gstRate: GstRate;

  status: ProductStatus;

  images: string[];
  category: ProductCategory;
  tags: string[];

  createdAt: string;
  updatedAt: string;
};

export type CreateProductDTO = {
  title: string;
  description: string;

  price: number;
  discountPercent: number;

  gstRate: GstRate;
  hsnCode: string;

  images: string[];
  category: ProductCategory;
  tags: string[];
};

export type UpdateProductDTO = Partial<CreateProductDTO>;