// lib/products/validators.ts

import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "@/types/product";

import { ProductInvalidInputError } from "./errors";

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isPositiveMoney(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v) && v > 0;
}

function assertNoForbiddenFields(obj: Record<string, unknown>) {
  const forbidden = [
    "productId",
    "currency",
    "isActive",
    "isDeleted",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];

  for (const key of forbidden) {
    if (key in obj) {
      throw new ProductInvalidInputError(`Field "${key}" is not allowed`);
    }
  }
}

export function validateCreateProduct(
  body: unknown
): asserts body is CreateProductDTO {
  if (!isObject(body)) throw new ProductInvalidInputError("Invalid body");

  assertNoForbiddenFields(body);

  if (!isNonEmptyString(body.title))
    throw new ProductInvalidInputError("Title required");

  if (!isPositiveMoney(body.price))
    throw new ProductInvalidInputError("Invalid price");
}

export function validateUpdateProduct(
  body: unknown
): asserts body is UpdateProductDTO {
  if (!isObject(body)) throw new ProductInvalidInputError("Invalid body");

  assertNoForbiddenFields(body);

  if (Object.keys(body).length === 0)
    throw new ProductInvalidInputError("Empty update");
}