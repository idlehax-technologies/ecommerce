export abstract class ProductDomainError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class ProductNotFoundError extends ProductDomainError {
  constructor(message = "Product not found") {
    super(message, 404);
  }
}

export class ProductForbiddenError extends ProductDomainError {
  constructor(message = "Product does not belong to your tenant") {
    super(message, 403);
  }
}

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

export class ProductInvalidInputError extends ProductDomainError {
  constructor(message = "Invalid product input") {
    super(message, 400);
  }
}

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
