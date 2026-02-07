// lib/products/errors.ts

/*
  Product Domain Errors

  Philosophy:
  - Domain must express *meaning*, not HTTP codes.
  - Routes translate these → 404 / 403 / 400 / 409 etc.
  - No side effects.
  - No business logic.
  - Just typed failure signals.

  Domain language example:
    throw new ProductNotFoundError()

  Route layer decides:
    ProductNotFoundError → 404
*/

/* ================================================== */
/* Base                                               */
/* ================================================== */

export abstract class ProductDomainError extends Error {
  readonly code: string;

  protected constructor(message: string, code: string) {
    super(message);
    this.name = new.target.name; // keeps class name at runtime
    this.code = code;
  }
}

/* ================================================== */
/* Existence                                          */
/* ================================================== */

export class ProductNotFoundError extends ProductDomainError {
  constructor() {
    super("Product not found", "PRODUCT_NOT_FOUND");
  }
}

/* ================================================== */
/* Authorization / Ownership                          */
/* ================================================== */

export class ForbiddenProductError extends ProductDomainError {
  constructor() {
    super(
      "Product does not belong to your tenant",
      "PRODUCT_FORBIDDEN"
    );
  }
}

/* ================================================== */
/* Lifecycle                                          */
/* ================================================== */

export class ProductDeletedError extends ProductDomainError {
  constructor() {
    super("Product has been deleted", "PRODUCT_DELETED");
  }
}

export class ProductInactiveError extends ProductDomainError {
  constructor() {
    super("Product is inactive", "PRODUCT_INACTIVE");
  }
}

/* ================================================== */
/* Validation                                         */
/* ================================================== */

export class InvalidProductInputError extends ProductDomainError {
  constructor(message = "Invalid product input") {
    super(message, "PRODUCT_INVALID_INPUT");
  }
}

/* ================================================== */
/* Conflicts / Business rules                         */
/* ================================================== */

export class ProductConflictError extends ProductDomainError {
  constructor(message = "Product conflict") {
    super(message, "PRODUCT_CONFLICT");
  }
}
