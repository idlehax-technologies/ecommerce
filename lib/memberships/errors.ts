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

export class MembershipAlreadyExistsError extends MembershipDomainError {
    constructor(message = "User already has pending or approved membership for this tenant") {
        super(message, 409);
    }
}

export class MembershipInvalidStateError extends MembershipDomainError {
    constructor(message = "Invalid membership state transition") {
        super(message, 409);
    }
}

export class MembershipInvalidInputError extends MembershipDomainError {
    constructor(message = "Invalid request body") {
        super(message, 400);
    }
}
