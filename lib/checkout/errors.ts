export abstract class CheckoutDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class CheckoutInvalidInputError extends CheckoutDomainError {
    constructor(message = "Invalid request body") {
        super(message, 400);
    }
}

export class CheckoutCartEmptyError extends CheckoutDomainError {
    constructor(message = "Cart is empty") {
        super(message, 400);
    }
}