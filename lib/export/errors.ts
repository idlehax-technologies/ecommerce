export abstract class ExportDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class ExportInvalidInputError extends ExportDomainError {
    constructor(message = "Invalid export input") {
        super(message, 400);
    }
}

export class ExportGenerationError extends ExportDomainError {
    constructor(message = "Failed to generate export") {
        super(message, 500);
    }
}