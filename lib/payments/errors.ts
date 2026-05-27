export abstract class PaymentDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class PaymentAlreadyExistsError extends PaymentDomainError {
    constructor(message = "Payment already recorded for this order") {
        super(message, 409);
    }
}

export class PaymentInvalidAmountError extends PaymentDomainError {
    constructor(message = "Payment amount mismatch") {
        super(message, 400);
    }
}

export class PaymentNotFoundError extends PaymentDomainError {
    constructor(message = "Payment not found") {
        super(message, 404);
    }
}