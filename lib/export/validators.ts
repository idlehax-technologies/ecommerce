export function validateExportRequest(input: unknown): asserts input is {
    type: "ORDERS" | "RECONCILIATION";
} {
    if (
        typeof input !== "object" ||
        input === null ||
        !("type" in input)
    ) {
        throw new Error("Invalid export request");
    }

    const type = (input as any).type;

    if (type !== "ORDERS" && type !== "RECONCILIATION") {
        throw new Error("Invalid export type");
    }
}