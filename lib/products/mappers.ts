import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  ProductChanges,
} from "@/types/product";

import { randomUUID } from "crypto";

function now(): string {
  return new Date().toISOString();
}

export function toNewProduct(input: CreateProductDTO): Product {
  const timestamp = now();

  return {
    productId: randomUUID(),

    title: input.title,
    description: input.description,

    price: input.price,
    currency: "INR",

    sku: input.sku,
    images: input.images,
    category: input.category,
    tags: input.tags,

    isActive: true,

    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function toProductUpdateChanges(
  patch: UpdateProductDTO
): ProductChanges {
  const safe: Omit<ProductChanges, "updatedAt"> = {};

  if (patch.title !== undefined) safe.title = patch.title;
  if (patch.description !== undefined) safe.description = patch.description;
  if (patch.price !== undefined) safe.price = patch.price;
  if (patch.sku !== undefined) safe.sku = patch.sku;
  if (patch.images !== undefined) safe.images = patch.images;
  if (patch.category !== undefined) safe.category = patch.category;
  if (patch.tags !== undefined) safe.tags = patch.tags;

  return {
    ...safe,
    updatedAt: now(),
  };
}