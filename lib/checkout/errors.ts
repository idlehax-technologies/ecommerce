// lib/checkout/errors.ts

export class CheckoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CheckoutError";
    }
}

export class InvalidCheckoutInputError extends CheckoutError {
    constructor(message = "Invalid checkout request") {
        super(message);
        this.name = "InvalidCheckoutInputError";
    }
}

export class ProductNotFoundError extends CheckoutError {
    constructor(message = "Product not found") {
        super(message);
        this.name = "ProductNotFoundError";
    }
}

export class OutOfStockError extends CheckoutError {
    constructor(message = "Insufficient stock") {
        super(message);
        this.name = "OutOfStockError";
    }
}
