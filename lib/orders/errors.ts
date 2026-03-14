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

export class EmptyOrderItemsError extends OrderDomainError {
    constructor() {
        super("Order must contain at least one item", 400);
    }
}

export class InvalidOrderItemQuantityError extends OrderDomainError {
    constructor() {
        super("Order item quantity must be greater than zero", 400);
    }
}

export class OrderTotalMismatchError extends OrderDomainError {
    constructor() {
        super("Order total does not match sum of order items", 400);
    }
}

export class InvalidOrderTransitionError extends OrderDomainError {
    constructor(from: string, to: string) {
        super(`Invalid order transition: ${from} → ${to}`, 400);
    }
}