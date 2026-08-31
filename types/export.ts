export type ExportType =
    | "ORDERS"
    | "RECONCILIATION";

export type ExportRequest = {
    type: ExportType;

    // Reserved for future chunked/paginated export support
    cursor?: string;
    limit?: number;
};

export type ExportResult = {
    filename: string;
    content: string;
};