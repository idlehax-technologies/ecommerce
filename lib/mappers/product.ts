// lib/mappers/product.ts

import type { Product } from "@/types/product";
import { productErrors } from "@/lib/errors/productErrors";

/**
 * Fields allowed to be patched by vendor.
 * (Explicit allowlist = safe)
 */
type ProductPatch = Partial<
  Pick<
    Product,
    | "title"
    | "description"
    | "price"
    | "stock"
    | "isActive"
    | "sku"
    | "images"
    | "category"
    | "tags"
  >
>;

/**
 * Request -> patch mapping
 * - drops unknown fields
 * - forbids vendorId/productId
 * - forbids createdAt/deletedAt
 */
export function mapUpdateProductBodyToPatch(body: unknown): ProductPatch {
  if (typeof body !== "object" || body === null) {
    throw productErrors.invalidPatch("Invalid request body");
  }

  const v = body as Record<string, unknown>;

  // Forbidden immutable fields
  if ("productId" in v || "vendorId" in v) {
    throw productErrors.invalidPatch("Cannot update vendorId/productId");
  }

  if ("createdAt" in v || "updatedAt" in v || "deletedAt" in v) {
    throw productErrors.invalidPatch("Cannot update timestamps");
  }

  if ("isDeleted" in v) {
    throw productErrors.invalidPatch("Cannot update isDeleted");
  }

  const patch: ProductPatch = {};

  // Allowlist mapping with runtime checks
  if (typeof v.title === "string") patch.title = v.title;
  if (typeof v.description === "string") patch.description = v.description;

  if (typeof v.price === "number" && Number.isInteger(v.price) && v.price > 0) {
    patch.price = v.price;
  } else if ("price" in v) {
    throw productErrors.invalidPatch("Price must be a positive integer");
  }

  if (
    typeof v.stock === "number" &&
    Number.isInteger(v.stock) &&
    v.stock >= 0
  ) {
    patch.stock = v.stock;
  } else if ("stock" in v) {
    throw productErrors.invalidPatch("Stock must be an integer >= 0");
  }

  if (typeof v.isActive === "boolean") patch.isActive = v.isActive;
  if (typeof v.sku === "string") patch.sku = v.sku;
  if (typeof v.category === "string") patch.category = v.category;

  if (Array.isArray(v.images)) {
    if (!v.images.every((x) => typeof x === "string")) {
      throw productErrors.invalidPatch("Images must be string array");
    }
    patch.images = v.images as string[];
  } else if ("images" in v) {
    throw productErrors.invalidPatch("Images must be an array");
  }

  if (Array.isArray(v.tags)) {
    if (!v.tags.every((x) => typeof x === "string")) {
      throw productErrors.invalidPatch("Tags must be string array");
    }
    patch.tags = v.tags as string[];
  } else if ("tags" in v) {
    throw productErrors.invalidPatch("Tags must be an array");
  }

  return patch;
}
