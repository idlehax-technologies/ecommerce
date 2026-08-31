import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "@/types/product";

import { randomUUID } from "crypto";

function now(): string {
  return new Date().toISOString();
}

export function toNewProduct(
  dto: CreateProductDTO,
  sku: string
): Product {
  const timestamp = now();

  return {
    productId: randomUUID(),
    sku,

    title: dto.title.trim(),
    description: dto.description.trim(),

    price: dto.price,
    discountPercent: dto.discountPercent,
    currency: "INR",

    gstRate: dto.gstRate,
    hsnCode: dto.hsnCode.trim(),

    images: dto.images
      .map((image) => image.trim())
      .filter(Boolean),
    category: dto.category,
    tags: dto.tags
      .map((tag) => tag.trim())
      .filter(Boolean),

    status: "INACTIVE",

    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function toUpdatedProduct(
  existing: Product,
  dto: UpdateProductDTO
): Product {
  return {
    ...existing,

    ...(dto.title !== undefined && {
      title: dto.title.trim(),
    }),

    ...(dto.description !== undefined && {
      description: dto.description.trim(),
    }),

    ...(dto.price !== undefined && {
      price: dto.price,
    }),

    ...(dto.discountPercent !== undefined && {
      discountPercent: dto.discountPercent,
    }),

    ...(dto.gstRate !== undefined && {
      gstRate: dto.gstRate,
    }),

    ...(dto.hsnCode !== undefined && {
      hsnCode: dto.hsnCode.trim(),
    }),

    ...(dto.images !== undefined && {
      images: dto.images
        .map((image) => image.trim())
        .filter(Boolean),
    }),

    ...(dto.category !== undefined && {
      category: dto.category,
    }),

    ...(dto.tags !== undefined && {
      tags: dto.tags
        .map((tag) => tag.trim())
        .filter(Boolean),
    }),

    updatedAt: now(),
  };
}