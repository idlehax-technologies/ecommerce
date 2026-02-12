export class TenantDomainError extends Error {
    status: number;

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

export class TenantAlreadyExistsError extends TenantDomainError {
    constructor(message = "Tenant already exists") {
        super(message, 409);
    }
}

export class TenantAlreadyActiveError extends TenantDomainError {
    constructor(message = "Tenant already active") {
        super(message, 409);
    }
}

export class TenantAlreadyInactiveError extends TenantDomainError {
    constructor(message = "Tenant already inactive") {
        super(message, 409);
    }
}

export class TenantInvalidInputError extends TenantDomainError {
    constructor(message = "Invalid tenant input") {
        super(message, 400);
    }
}

export class TenantPermissionError extends TenantDomainError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}
