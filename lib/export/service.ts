import { generateExport } from "./domain";
import { toCSV } from "./csv";

import type { ExportRequest, ExportResult } from "@/types/export";

export async function exportData(
    tenantId: string,
    request: ExportRequest
): Promise<ExportResult> {

    const result = await generateExport(tenantId, request);

    const csv = toCSV(result.headers, result.rows);

    return {
        filename: result.filename,
        content: csv,
    };
}