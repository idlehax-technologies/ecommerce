export abstract class CheckoutDomainError extends Error {
    readonly status: number;
    readonly code: string;

    constructor(message: string, status: number, code: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

export class CheckoutInvalidInputError extends CheckoutDomainError {
    constructor(message = "Invalid checkout input") {
        super(message, 400, "INVALID_INPUT");
    }
}

export class OrderItemNotFoundError extends CheckoutDomainError {
    constructor(message = "Order item no longer available") {
        super(message, 404, "PRODUCT_NOT_FOUND");
    }
}

export class ProductOutOfStockError extends CheckoutDomainError {
    constructor(message = "Insufficient stock") {
        super(message, 409, "OUT_OF_STOCK");
    }
}
