export abstract class OrderDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class OrderNotFoundError extends OrderDomainError {
    constructor() {
        super("Order not found", 404);
    }
}