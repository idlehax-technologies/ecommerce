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

export class ProductSkuAlreadyExistsError extends ProductDomainError {
  constructor(message = "Product SKU already exists") {
    super(message, 409);
  }
}