export abstract class TenantDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class TenantNotFoundError extends TenantDomainError {
    constructor(message = "Tenant not found") {
        super(message, 404);
    }
}

export class TenantAlreadyActiveError extends TenantDomainError {
    constructor(message = "Tenant already active") {
        super(message, 409);
    }
}

export class TenantCannotActivateError extends TenantDomainError {
    constructor(message = "Tenant cannot be activated") {
        super(message, 409);
    }
}

export class TenantCannotSuspendError extends TenantDomainError {
    constructor(message = "Tenant cannot be suspended") {
        super(message, 409);
    }
}

export class TenantCannotArchiveError extends TenantDomainError {
    constructor(message = "Tenant cannot be archived") {
        super(message, 409);
    }
}

export class TenantInvalidInputError extends TenantDomainError {
    constructor(message = "Invalid tenant input") {
        super(message, 400);
    }
}
