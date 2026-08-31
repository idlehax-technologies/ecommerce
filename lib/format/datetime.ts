export function formatDateTime(
    value: string
): string {
    return new Date(value).toLocaleString(
        "en-IN",
        {
            timeZone: "Asia/Kolkata",
        }
    );
}