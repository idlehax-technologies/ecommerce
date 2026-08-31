export type GstInvoiceLine = {
    unitPriceExGst: number;

    grossValue: number;
    discountValue: number;
    taxableValue: number;

    cgst: number;
    sgst: number;

    amount: number;
};

export type GstInvoiceTotals = {
    subtotal: number;

    cgst: number;
    sgst: number;

    total: number;
};