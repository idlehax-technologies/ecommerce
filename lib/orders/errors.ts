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

export class InvalidOrderInvoiceStateError extends OrderDomainError {
    constructor(message = "Invalid invoice state") {
        super(message, 500);
    }
}

export class OrderNumberAlreadyExistsError extends OrderDomainError {
    constructor(message = "Order number already exists") {
        super(message, 409);
    }
}

export class InvoiceNumberAlreadyExistsError extends OrderDomainError {
    constructor(message = "Invoice number already exists") {
        super(message, 409);
    }
}