export abstract class CheckoutDomainError extends Error {
    readonly status: number;
    readonly code:
        | "UNAUTHORIZED"
        | "INVALID_INPUT"
        | "PRODUCT_NOT_FOUND"
        | "OUT_OF_STOCK"
        | "CHECKOUT_FAILED"
        | "SERVER_ERROR";

    constructor(
        message: string,
        code: CheckoutDomainError["code"],
        status: number
    ) {
        super(message);
        this.code = code;
        this.status = status;
    }
}

export class CheckoutInvalidInputError extends CheckoutDomainError {
    constructor(message = "Invalid checkout input") {
        super(message, "INVALID_INPUT", 400);
    }
}

export class CheckoutOutOfStockError extends CheckoutDomainError {
    constructor(message = "Item is out of stock") {
        super(message, "OUT_OF_STOCK", 409);
    }
}

export class CheckoutFailedError extends CheckoutDomainError {
    constructor(message = "Checkout failed") {
        super(message, "CHECKOUT_FAILED", 500);
    }
}