export abstract class TenantInventoryDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class InvalidInventoryInputError extends TenantInventoryDomainError {
    constructor(message = "Invalid request body") {
        super(message, 400);
    }
}

export class InvalidQuantityError extends TenantInventoryDomainError {
    constructor(message = "Invalid quantity") {
        super(message, 400);
    }
}

export class OutOfStockError extends TenantInventoryDomainError {
    constructor(productId: string) {
        super(`Product ${productId} is out of stock`, 409);
    }
}

export class ReservationStateError extends TenantInventoryDomainError {
    constructor(message = "Invalid reservation state") {
        super(message, 409);
    }
}

export class ProvisionNotFoundError extends TenantInventoryDomainError {
    constructor(productId: string) {
        super(
            `Product ${productId} is not provisioned for this tenant`,
            404
        );
    }
}

export class InventoryInvariantViolationError extends TenantInventoryDomainError {
    constructor(message = "Inventory invariant violated") {
        super(message, 500);
    }
}

export class CannotDisableWithActiveReservationsError extends TenantInventoryDomainError {
    constructor(productId: string) {
        super(
            `Cannot disable product ${productId} while reservations exist`,
            409
        );
    }
}