// lib/tenantInventory/errors.ts

export class TenantInventoryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TenantInventoryError";
    }
}

export class ProvisionConflictError extends TenantInventoryError {
    constructor(productId: string) {
        super(`Product ${productId} is already provisioned for this tenant`);
    }
}

export class ProvisionNotFoundError extends TenantInventoryError {
    constructor(productId: string) {
        super(`Product ${productId} is not provisioned for this tenant`);
    }
}

export class InvalidProvisionInputError extends TenantInventoryError {
    constructor(message = "Invalid provisioning input") {
        super(message);
    }
}