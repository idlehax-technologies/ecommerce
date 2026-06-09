import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "@/types/product";

import { ProductInvalidInputError } from "./errors";

import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "./categories";

import {
  GST_RATES,
  type GstRate,
} from "./gst";

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

function isGstRate(
  value: unknown
): value is GstRate {
  return GST_RATES.includes(
    value as GstRate
  );
}

export function isProductCategory(
  value: unknown
): value is ProductCategory {
  return PRODUCT_CATEGORIES.some(
    category => category.name === value
  );
}

function assertNoForbiddenFields(obj: Record<string, unknown>) {
  const forbidden = [
    "productId",
    "currency",
    "status",
    "createdAt",
    "updatedAt",
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

  if (!isGstRate(body.gstRate)) {
    throw new ProductInvalidInputError(
      "GST rate must be a valid GST slab"
    );
  }

  if (!isNonEmptyString(body.hsnCode)) {
    throw new ProductInvalidInputError(
      "HSN code must be a non-empty string"
    );
  }

  if (!isNonEmptyString(body.description)) {
    throw new ProductInvalidInputError(
      "Description must be a non-empty string"
    );
  }

  if (!isProductCategory(body.category)) {
    throw new ProductInvalidInputError(
      "Category must be a valid product category"
    );
  }

  if (
    !Array.isArray(body.images) ||
    body.images.length === 0 ||
    body.images.some(img => !isNonEmptyString(img))
  ) {
    throw new ProductInvalidInputError(
      "Images must contain at least one image"
    );
  }

  if (
    !Array.isArray(body.tags) ||
    body.tags.length === 0 ||
    body.tags.some(tag => !isNonEmptyString(tag))
  ) {
    throw new ProductInvalidInputError(
      "Tags must contain at least one tag"
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
    !isNonEmptyString(body.description)
  ) {
    throw new ProductInvalidInputError(
      "Description must be a non-empty string"
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
    "gstRate" in body &&
    body.gstRate !== undefined &&
    !isGstRate(body.gstRate)
  ) {
    throw new ProductInvalidInputError(
      "GST rate must be a valid GST slab"
    );
  }

  if (
    "hsnCode" in body &&
    body.hsnCode !== undefined &&
    !isNonEmptyString(body.hsnCode)
  ) {
    throw new ProductInvalidInputError(
      "HSN code must be a non-empty string"
    );
  }

  if (
    "category" in body &&
    body.category !== undefined &&
    !isProductCategory(body.category)
  ) {
    throw new ProductInvalidInputError(
      "Category must be a valid product category"
    );
  }

  if (
    "images" in body &&
    body.images !== undefined &&
    (
      !Array.isArray(body.images) ||
      body.images.some(img => !isNonEmptyString(img))
    )
  ) {
    throw new ProductInvalidInputError(
      "Images must be a non-empty array of non-empty strings"
    );
  }

  if (
    "tags" in body &&
    body.tags !== undefined &&
    (
      !Array.isArray(body.tags) ||
      body.tags.some(tag => !isNonEmptyString(tag))
    )
  ) {
    throw new ProductInvalidInputError(
      "Tags must be a non-empty array of non-empty strings"
    );
  }
}