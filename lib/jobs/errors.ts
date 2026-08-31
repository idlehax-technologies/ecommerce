export abstract class JobDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class JobNotFoundError extends JobDomainError {
    constructor(message = "Job not found") {
        super(message, 404);
    }
}

export class JobRetryNotAllowedError extends JobDomainError {
    constructor(message = "Job cannot be retried in its current state") {
        super(message, 409);
    }
}