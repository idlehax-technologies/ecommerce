export abstract class AuthDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class InvalidOtpError extends AuthDomainError {
    constructor(message = "Invalid or expired OTP") {
        super(message, 401);
    }
}

export class OtpRateLimitError extends AuthDomainError {
    constructor(message = "Too many OTP requests. Try again later.") {
        super(message, 429);
    }
}

export class UserNotFoundError extends AuthDomainError {
    constructor(message = "User not found") {
        super(message, 404);
    }
}

export class UnauthorizedError extends AuthDomainError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class ForbiddenError extends AuthDomainError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

export class TenantNotAssociatedError extends AuthDomainError {
    constructor(message = "User is not associated with a tenant") {
        super(message, 403);
    }
}

export class NotInAssumedSessionError extends AuthDomainError {
    constructor(message = "Operation requires an assumed session") {
        super(message, 400);
    }
}
