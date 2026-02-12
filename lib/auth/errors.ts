export class AuthDomainError extends Error {
    status: number;

    constructor(message: string, status = 400) {
        super(message);
        this.status = status;
    }
}

export class InvalidOtpError extends AuthDomainError {
    constructor() {
        super("Invalid or expired OTP", 401);
    }
}

export class OtpRateLimitError extends AuthDomainError {
    constructor() {
        super("Too many OTP requests. Try again later.", 429);
    }
}

export class UserNotFoundError extends AuthDomainError {
    constructor() {
        super("User not found", 404);
    }
}
