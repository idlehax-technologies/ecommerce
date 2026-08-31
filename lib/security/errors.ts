export abstract class SecurityDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class CsrfValidationError extends SecurityDomainError {
    constructor(message = "CSRF validation failed") {
        super(message, 403);
    }
}

export class TooManyRequestsError extends SecurityDomainError {
    constructor(message = "Too many requests") {
        super(message, 429);
    }
}