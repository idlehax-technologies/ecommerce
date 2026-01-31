// lib/errors/productErrors.ts

export type ProductErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "DELETED"
  | "INVALID_PATCH";

export class ProductDomainError extends Error {
  public code: ProductErrorCode;
  public status: number;

  constructor(code: ProductErrorCode, message: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

// Convenience constructors (cleaner call-sites)
export const productErrors = {
  unauthenticated() {
    return new ProductDomainError(
      "UNAUTHENTICATED",
      "Unauthenticated",
      401
    );
  },

  forbidden() {
    return new ProductDomainError("FORBIDDEN", "Forbidden", 403);
  },

  notFound() {
    return new ProductDomainError("NOT_FOUND", "Product not found", 404);
  },

  deleted() {
    return new ProductDomainError(
      "DELETED",
      "Product has been deleted",
      410
    );
  },

  invalidPatch(msg = "Invalid update payload") {
    return new ProductDomainError("INVALID_PATCH", msg, 400);
  },
};
