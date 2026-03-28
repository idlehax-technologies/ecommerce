export abstract class PaymentDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class PaymentAlreadyExistsError extends PaymentDomainError {
    constructor() {
        super("Payment already recorded for this order", 409);
    }
}

export class PaymentInvalidAmountError extends PaymentDomainError {
    constructor() {
        super("Payment amount mismatch", 400);
    }
}