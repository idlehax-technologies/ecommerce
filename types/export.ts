export type ExportType =
    | "ORDERS"
    | "RECONCILIATION";

export type ExportRequest = {
    type: ExportType;

    cursor?: string; // pagination ready
    limit?: number;
};

export type ExportResult = {
    filename: string;
    content: string;
};