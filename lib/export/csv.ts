export function toCSV(
    headers: readonly string[],
    rows: readonly Record<string, unknown>[]
): string {

    if (rows.length === 0) {
        return "No data\n";
    }

    const keys = Object.keys(rows[0]);

    function escape(value: unknown): string {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        const str = String(value);

        if (
            str.includes(",") ||
            str.includes('"') ||
            str.includes("\n")
        ) {
            return `"${str.replace(/"/g, '""')}"`;
        }

        return str;
    }

    const lines = [
        headers.join(","),
        ...rows.map(row =>
            keys
                .map(key => escape(row[key]))
                .join(",")
        ),
    ];

    return lines.join("\n");
}