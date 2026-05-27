import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "@/types/product";

import { ProductInvalidInputError } from "./errors";

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isNonEmptyString(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
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
  if (!isObject(body)) {
    throw new ProductInvalidInputError("Invalid request body");
  }

  assertNoForbiddenFields(body);

  if (!isNonEmptyString(body.title)) {
    throw new ProductInvalidInputError(
      "Title must be a non-empty string"
    );
  }

  if (!isPositiveMoney(body.price)) {
    throw new ProductInvalidInputError(
      "Price must be a positive number"
    );
  }

  if (
    "description" in body &&
    body.description !== undefined &&
    typeof body.description !== "string"
  ) {
    throw new ProductInvalidInputError(
      "Description must be a string"
    );
  }

  if (
    "sku" in body &&
    body.sku !== undefined &&
    typeof body.sku !== "string"
  ) {
    throw new ProductInvalidInputError(
      "SKU must be a string"
    );
  }

  if (
    "category" in body &&
    body.category !== undefined &&
    typeof body.category !== "string"
  ) {
    throw new ProductInvalidInputError(
      "Category must be a string"
    );
  }

  if (
    "images" in body &&
    body.images !== undefined &&
    (
      !Array.isArray(body.images) ||
      body.images.some(img => typeof img !== "string")
    )
  ) {
    throw new ProductInvalidInputError(
      "Images must be an array of strings"
    );
  }

  if (
    "tags" in body &&
    body.tags !== undefined &&
    (
      !Array.isArray(body.tags) ||
      body.tags.some(tag => typeof tag !== "string")
    )
  ) {
    throw new ProductInvalidInputError(
      "Tags must be an array of strings"
    );
  }
}

export function validateUpdateProduct(
  body: unknown
): asserts body is UpdateProductDTO {
  if (!isObject(body)) {
    throw new ProductInvalidInputError("Invalid request body");
  }

  assertNoForbiddenFields(body);

  if (Object.keys(body).length === 0) {
    throw new ProductInvalidInputError(
      "Update payload cannot be empty"
    );
  }

  if (
    "title" in body &&
    body.title !== undefined &&
    !isNonEmptyString(body.title)
  ) {
    throw new ProductInvalidInputError(
      "Title must be a non-empty string"
    );
  }

  if (
    "description" in body &&
    body.description !== undefined &&
    typeof body.description !== "string"
  ) {
    throw new ProductInvalidInputError(
      "Description must be a string"
    );
  }

  if (
    "price" in body &&
    body.price !== undefined &&
    !isPositiveMoney(body.price)
  ) {
    throw new ProductInvalidInputError(
      "Price must be a positive number"
    );
  }

  if (
    "sku" in body &&
    body.sku !== undefined &&
    typeof body.sku !== "string"
  ) {
    throw new ProductInvalidInputError(
      "SKU must be a string"
    );
  }

  if (
    "category" in body &&
    body.category !== undefined &&
    typeof body.category !== "string"
  ) {
    throw new ProductInvalidInputError(
      "Category must be a string"
    );
  }

  if (
    "images" in body &&
    body.images !== undefined &&
    (
      !Array.isArray(body.images) ||
      body.images.some(img => typeof img !== "string")
    )
  ) {
    throw new ProductInvalidInputError(
      "Images must be an array of strings"
    );
  }

  if (
    "tags" in body &&
    body.tags !== undefined &&
    (
      !Array.isArray(body.tags) ||
      body.tags.some(tag => typeof tag !== "string")
    )
  ) {
    throw new ProductInvalidInputError(
      "Tags must be an array of strings"
    );
  }
}