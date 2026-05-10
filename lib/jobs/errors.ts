export abstract class JobDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class JobNotFoundError extends JobDomainError {
    constructor() {
        super("Job not found", 404);
    }
}

export class JobRetryNotAllowedError extends JobDomainError {
    constructor() {
        super("Job cannot be retried in its current state", 409);
    }
}