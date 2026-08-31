export function formatUnknownValue(
    value: unknown
): string {

    if (
        value === null ||
        typeof value !== "object"
    ) {
        return String(value);
    }

    return JSON.stringify(value);
}