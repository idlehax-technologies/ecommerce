/**
 * Product Domain Errors
 *
 * Philosophy (aligned with current system):
 * - Domain expresses failure + HTTP meaning together.
 * - Routes forward { message, status } without translation tables.
 * - Errors are immutable signals.
 */

export abstract class ProductDomainError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/* ================================================== */
/* Existence                                          */
/* ================================================== */

export class ProductNotFoundError extends ProductDomainError {
  constructor(message = "Product not found") {
    super(message, 404);
  }
}

/* ================================================== */
/* Authorization / Ownership                          */
/* ================================================== */

export class ProductForbiddenError extends ProductDomainError {
  constructor(message = "Product does not belong to your tenant") {
    super(message, 403);
  }
}

/* ================================================== */
/* Lifecycle                                          */
/* ================================================== */

export class ProductDeletedError extends ProductDomainError {
  constructor(message = "Product has been deleted") {
    super(message, 409);
  }
}

export class ProductInactiveError extends ProductDomainError {
  constructor(message = "Product is inactive") {
    super(message, 409);
  }
}

/* ================================================== */
/* Validation                                         */
/* ================================================== */

export class ProductInvalidInputError extends ProductDomainError {
  constructor(message = "Invalid product input") {
    super(message, 400);
  }
}

/* ================================================== */
/* Conflicts / Business rules                         */
/* ================================================== */

export class ProductConflictError extends ProductDomainError {
  constructor(message = "Product conflict") {
    super(message, 409);
  }
}

export class ProductOutOfStockError extends ProductDomainError {
  constructor(message = "Product is out of stock") {
    super(message, 409);
  }
}
