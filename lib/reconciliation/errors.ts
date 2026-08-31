export abstract class ReconciliationDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class ReconciliationInvalidInputError
    extends ReconciliationDomainError {

    constructor(message = "Invalid request body") {
        super(message, 400);
    }
}

export class ReconciliationActionNotAllowedError
    extends ReconciliationDomainError {

    constructor(message = "Action not allowed for this mismatch") {
        super(message, 400);
    }
}

export class ReconciliationInventoryNotFoundError
    extends ReconciliationDomainError {

    constructor(message = "Inventory not found") {
        super(message, 404);
    }
}

export class ReconciliationUnsupportedActionError
    extends ReconciliationDomainError {

    constructor(message = "Unsupported resolution action") {
        super(message, 400);
    }
}