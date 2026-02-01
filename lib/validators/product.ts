import { CreateProductDTO, UpdateProductDTO } from "@/types/product.dto";

// --------------------------------------
// helpers
// --------------------------------------

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0
  );
}

function isPositiveMoney(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function assertNoForbiddenFields(obj: Record<string, unknown>) {
  if ("vendorId" in obj || "productId" in obj) {
    throw new Error("Forbidden fields in request body");
  }
}

// --------------------------------------
// Create validation
// --------------------------------------

export function validateCreateProduct(body: unknown): asserts body is CreateProductDTO {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid request body");
  }

  const v = body as Record<string, unknown>;

  assertNoForbiddenFields(v);

  if (!isNonEmptyString(v.title)) {
    throw new Error("Product title is required");
  }

  if (!isPositiveMoney(v.price)) {
    throw new Error("Price must be a positive integer");
  }

  if (!isPositiveInteger(v.stock)) {
    throw new Error("Stock must be an integer >= 0");
  }

  if (v.images && !Array.isArray(v.images)) {
    throw new Error("Images must be an array");
  }

  if (Array.isArray(v.images)) {
    for (const img of v.images) {
      if (typeof img !== "string") {
        throw new Error("Image URLs must be strings");
      }
    }
  }

  if (v.tags && !Array.isArray(v.tags)) {
    throw new Error("Tags must be an array");
  }

  if (Array.isArray(v.tags)) {
    for (const tag of v.tags) {
      if (typeof tag !== "string") {
        throw new Error("Tags must be strings");
      }
    }
  }
}

// --------------------------------------
// Update validation (partial)
// --------------------------------------

export function validateUpdateProduct(body: unknown): asserts body is UpdateProductDTO {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid request body");
  }

  const v = body as Record<string, unknown>;

  assertNoForbiddenFields(v);

  if ("price" in v && !isPositiveMoney(v.price)) {
    throw new Error("Price must be a positive integer");
  }

  if ("stock" in v && !isPositiveInteger(v.stock)) {
    throw new Error("Stock must be an integer >= 0");
  }

  if ("title" in v && !isNonEmptyString(v.title)) {
    throw new Error("Title must be a non-empty string");
  }

  if ("images" in v && !Array.isArray(v.images)) {
    throw new Error("Images must be an array");
  }

  if (Array.isArray(v.images)) {
    for (const img of v.images) {
      if (typeof img !== "string") {
        throw new Error("Image URLs must be strings");
      }
    }
  }

  if ("tags" in v && !Array.isArray(v.tags)) {
    throw new Error("Tags must be an array");
  }

  if (Array.isArray(v.tags)) {
    for (const tag of v.tags) {
      if (typeof tag !== "string") {
        throw new Error("Tags must be strings");
      }
    }
  }
}
