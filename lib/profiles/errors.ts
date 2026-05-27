export abstract class ProfileDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class ProfileInvalidInputError extends ProfileDomainError {
    constructor(message = "Invalid request body") {
        super(message, 400);
    }
}

export class ProfileIncompleteError extends ProfileDomainError {
    constructor(message = "All profile fields are required") {
        super(message, 400);
    }
}

export class ProfileRequiredError extends ProfileDomainError {
    constructor(message = "Profile must be completed before requesting membership") {
        super(message, 400);
    }
}