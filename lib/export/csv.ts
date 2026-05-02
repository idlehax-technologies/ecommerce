export function toCSV(rows: Record<string, unknown>[]): string {
    if (rows.length === 0) {
        return "no_data\n";
    }

    // collect ALL keys deterministically
    const headerSet = new Set<string>();

    for (const row of rows) {
        for (const key of Object.keys(row)) {
            headerSet.add(key);
        }
    }

    const headers = Array.from(headerSet).sort();

    const escape = (value: unknown) => {
        if (value === null || value === undefined) return "";
        const str = String(value);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const lines = [
        headers.join(","),
        ...rows.map(row =>
            headers.map(h => escape(row[h])).join(",")
        ),
    ];

    return lines.join("\n");
}