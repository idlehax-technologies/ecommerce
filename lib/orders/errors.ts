export abstract class OrderDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class OrderNotFoundError extends OrderDomainError {
    constructor(message = "Order not found") {
        super(message, 404);
    }
}

export class EmptyOrderItemsError extends OrderDomainError {
    constructor(message = "Order must contain at least one item") {
        super(message, 400);
    }
}

export class InvalidOrderItemQuantityError extends OrderDomainError {
    constructor(message = "Order item quantity must be greater than zero") {
        super(message, 400);
    }
}

export class OrderTotalMismatchError extends OrderDomainError {
    constructor(message = "Order total does not match sum of order items") {
        super(message, 400);
    }
}

export class InvalidOrderTransitionError extends OrderDomainError {
    constructor(from: string, to: string) {
        super(`Invalid order transition: ${from} → ${to}`, 400);
    }
}