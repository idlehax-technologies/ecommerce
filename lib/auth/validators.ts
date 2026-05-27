import { InvalidOtpError } from "./errors";

function isNonEmptyString(
    value: unknown
): value is string {
    return (
        typeof value === "string" &&
        value.trim().length > 0
    );
}

export function assertOtpRequest(
    body: unknown
): asserts body is { phone: string } {

    if (
        !body ||
        typeof body !== "object"
    ) {
        throw new InvalidOtpError(
            "Invalid request body"
        );
    }

    const obj = body as Record<string, unknown>;

    if (!isNonEmptyString(obj.phone)) {
        throw new InvalidOtpError(
            "Phone must be a non-empty string"
        );
    }

    if (!/^\d{10}$/.test(obj.phone.trim())) {
        throw new InvalidOtpError(
            "Phone must be a valid 10-digit number"
        );
    }
}

export function assertOtpVerify(
    body: unknown
): asserts body is {
    phone: string;
    code: string;
} {

    if (
        !body ||
        typeof body !== "object"
    ) {
        throw new InvalidOtpError(
            "Invalid request body"
        );
    }

    const obj = body as Record<string, unknown>;

    if (!isNonEmptyString(obj.phone)) {
        throw new InvalidOtpError(
            "Phone must be a non-empty string"
        );
    }

    if (!/^\d{10}$/.test(obj.phone.trim())) {
        throw new InvalidOtpError(
            "Phone must be a valid 10-digit number"
        );
    }

    if (!isNonEmptyString(obj.code)) {
        throw new InvalidOtpError(
            "Code must be a non-empty string"
        );
    }
}