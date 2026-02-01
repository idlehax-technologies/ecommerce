export type Product = {
  productId: string;        // immutable
  vendorId: string;         // immutable (from JWT)

  title: string;
  description?: string;

  price: number;            // smallest currency unit
  currency: "INR";

  stock: number;            // integer >= 0

  isActive: boolean;
  isDeleted: boolean;

  sku?: string;
  images?: string[];
  category?: string;
  tags?: string[];

  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export type PublicProduct = Omit<Product, "vendorId">;
