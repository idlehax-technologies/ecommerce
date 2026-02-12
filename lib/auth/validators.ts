export function assertOtpRequest(body: unknown): asserts body is { phone: string } {
    if (!body || typeof body !== "object") throw new Error("Invalid body");

    const b = body as any;

    if (typeof b.phone !== "string" || b.phone.length < 8)
        throw new Error("Invalid phone");
}

export function assertOtpVerify(body: unknown): asserts body is { phone: string; code: string } {
    if (!body || typeof body !== "object") throw new Error("Invalid body");

    const b = body as any;

    if (typeof b.phone !== "string") throw new Error("Invalid phone");
    if (typeof b.code !== "string") throw new Error("Invalid code");
}
