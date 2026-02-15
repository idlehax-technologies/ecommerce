export abstract class MembershipDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class MembershipNotFoundError extends MembershipDomainError {
    constructor(message = "Membership not found") {
        super(message, 404);
    }
}

export class MembershipAlreadyActiveError extends MembershipDomainError {
    constructor(message = "User already has access or a pending request for this tenant") {
        super(message, 409);
    }
}

export class MembershipInvalidStateError extends MembershipDomainError {
    constructor(message = "Invalid membership state transition") {
        super(message, 409);
    }
}

export class MembershipValidationError extends MembershipDomainError {
    constructor(message = "Invalid request body") {
        super(message, 400);
    }
}
