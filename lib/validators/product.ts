// lib/validators/product.ts

import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "@/types/product.dto";

import { InvalidProductInputError } from "../errors/productErrors";

/*
  =========================================================
  Product Validators (HTTP boundary only)
  =========================================================

  Responsibilities:
  - Validate request JSON
  - Narrow unknown → DTO types
  - Throw InvalidProductInputError only
  - No domain logic
  - No guards
  - No DB

  These protect the boundary BEFORE data enters domain.
*/


/* =========================================================
   Small helpers (boring predicates)
   ========================================================= */

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isPositiveInteger(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 0;
}

function isPositiveMoney(v: unknown): v is number {
  return isPositiveInteger(v) && v > 0;
}


/* =========================================================
   Shared checks
   ========================================================= */

function assertImages(v: unknown): asserts v is string[] {
  if (!Array.isArray(v)) {
    throw new InvalidProductInputError("Images must be an array");
  }

  for (const img of v) {
    if (typeof img !== "string") {
      throw new InvalidProductInputError("Image URLs must be strings");
    }
  }
}

function assertTags(v: unknown): asserts v is string[] {
  if (!Array.isArray(v)) {
    throw new InvalidProductInputError("Tags must be an array");
  }

  for (const tag of v) {
    if (typeof tag !== "string") {
      throw new InvalidProductInputError("Tags must be strings");
    }
  }
}

function assertNoForbiddenFields(
  obj: Record<string, unknown>
) {
  const forbidden = [
    "productId",
    "vendorId",
    "createdAt",
    "updatedAt",
    "isDeleted",
  ];

  for (const key of forbidden) {
    if (key in obj) {
      throw new InvalidProductInputError(`Field "${key}" is not allowed`);
    }
  }
}


/* =========================================================
   Create Validator
   ========================================================= */

/**
 * unknown → CreateProductDTO
 */
export function validateCreateProduct(
  body: unknown
): asserts body is CreateProductDTO {
  if (!isObject(body)) {
    throw new InvalidProductInputError("Invalid request body");
  }

  const v = body;

  assertNoForbiddenFields(v);

  if (!isNonEmptyString(v.title)) {
    throw new InvalidProductInputError("Title is required");
  }

  if (!isPositiveMoney(v.price)) {
    throw new InvalidProductInputError("Price must be positive");
  }

  if (!isPositiveInteger(v.stock)) {
    throw new InvalidProductInputError("Stock must be >= 0");
  }

  if ("description" in v && v.description !== undefined && !isNonEmptyString(v.description)) {
    throw new InvalidProductInputError("Description must be a string");
  }

  if ("sku" in v && v.sku !== undefined && !isNonEmptyString(v.sku)) {
    throw new InvalidProductInputError("SKU must be a string");
  }

  if ("category" in v && v.category !== undefined && !isNonEmptyString(v.category)) {
    throw new InvalidProductInputError("Category must be a string");
  }

  if ("images" in v && v.images !== undefined) {
    assertImages(v.images);
  }

  if ("tags" in v && v.tags !== undefined) {
    assertTags(v.tags);
  }
}


/* =========================================================
   Update Validator
   ========================================================= */

/**
 * unknown → UpdateProductDTO
 * partial allowed, but must contain at least one field
 */
export function validateUpdateProduct(
  body: unknown
): asserts body is UpdateProductDTO {
  if (!isObject(body)) {
    throw new InvalidProductInputError("Invalid request body");
  }

  const v = body;

  assertNoForbiddenFields(v);

  if (Object.keys(v).length === 0) {
    throw new InvalidProductInputError("Empty update body");
  }

  if ("title" in v && !isNonEmptyString(v.title)) {
    throw new InvalidProductInputError("Title must be a string");
  }

  if ("price" in v && !isPositiveMoney(v.price)) {
    throw new InvalidProductInputError("Price must be positive");
  }

  if ("stock" in v && !isPositiveInteger(v.stock)) {
    throw new InvalidProductInputError("Stock must be >= 0");
  }

  if ("description" in v && v.description !== undefined && !isNonEmptyString(v.description)) {
    throw new InvalidProductInputError("Description must be a string");
  }

  if ("sku" in v && v.sku !== undefined && !isNonEmptyString(v.sku)) {
    throw new InvalidProductInputError("SKU must be a string");
  }

  if ("category" in v && v.category !== undefined && !isNonEmptyString(v.category)) {
    throw new InvalidProductInputError("Category must be a string");
  }

  if ("images" in v && v.images !== undefined) {
    assertImages(v.images);
  }

  if ("tags" in v && v.tags !== undefined) {
    assertTags(v.tags);
  }
}
