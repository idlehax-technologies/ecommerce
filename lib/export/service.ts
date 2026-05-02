import { generateExport } from "./domain";
import { toCSV } from "./csv";

import type { ExportRequest, ExportResult } from "@/types/export";

export function exportData(
    tenantId: string,
    request: ExportRequest
): ExportResult {

    const result = generateExport(tenantId, request);

    const csv = toCSV(result.rows);

    return {
        filename: result.filename,
        content: csv,
    };
}