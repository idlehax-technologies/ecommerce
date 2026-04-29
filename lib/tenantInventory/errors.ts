export class TenantInventoryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TenantInventoryError";
    }
}

export class InvalidInventoryInputError extends TenantInventoryError {
    constructor(message = "Invalid inventory input") {
        super(message);
    }
}

export class InvalidQuantityError extends TenantInventoryError {
    constructor(message = "Invalid quantity") {
        super(message);
    }
}

export class OutOfStockError extends TenantInventoryError {
    constructor(productId: string) {
        super(`Product ${productId} is out of stock`);
    }
}

export class ReservationStateError extends TenantInventoryError {
    constructor(message: string) {
        super(message);
    }
}

export class ProvisionNotFoundError extends TenantInventoryError {
    constructor(productId: string) {
        super(`Product ${productId} is not provisioned for this tenant`);
    }
}

export class ProvisionConflictError extends TenantInventoryError {
    constructor(productId: string) {
        super(`Product ${productId} is already provisioned for this tenant`);
    }
}

export class InventoryInvariantViolationError extends TenantInventoryError {
    constructor(message = "Inventory invariant violated") {
        super(message);
    }
}

export class CannotDisableWithActiveReservationsError extends TenantInventoryError {
    constructor(productId: string) {
        super(`Cannot disable product ${productId} while reservations exist`);
    }
}