import type {
    GstInvoiceLine,
    GstInvoiceTotals,
} from "@/types/invoice";

import type { ItemSnapshot } from "@/types/order";

function roundCurrency(
    value: number
): number {
    return Math.round(value);
}

export function getGstInvoiceLine(
    item: ItemSnapshot
): GstInvoiceLine {

    const unitPriceExGst =
        roundCurrency(
            item.price *
            100 / (100 + item.gstRate)
        );

    const grossValue =
        unitPriceExGst * item.quantity;

    const discountValue =
        roundCurrency(
            grossValue *
            item.discountPercent / 100
        );

    const taxableValue =
        grossValue - discountValue;

    const cgst =
        roundCurrency(
            taxableValue *
            (item.gstRate / 2) / 100
        );

    const sgst =
        roundCurrency(
            taxableValue *
            (item.gstRate / 2) / 100
        );

    const amount =
        taxableValue + cgst + sgst;

    return {
        unitPriceExGst,

        grossValue,
        discountValue,
        taxableValue,

        cgst,
        sgst,

        amount,
    };
}

export function getGstInvoiceTotals(
    items: ItemSnapshot[]
): GstInvoiceTotals {

    const lines =
        items.map(getGstInvoiceLine);

    const subtotal =
        lines.reduce(
            (sum, line) =>
                sum +
                line.taxableValue,
            0
        );

    const cgst =
        lines.reduce(
            (sum, line) =>
                sum +
                line.cgst,
            0
        );

    const sgst =
        lines.reduce(
            (sum, line) =>
                sum +
                line.sgst,
            0
        );

    return {
        subtotal,

        cgst,
        sgst,

        total:
            subtotal + cgst + sgst,
    };
}