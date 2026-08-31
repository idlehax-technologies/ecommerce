export type PricingTotals = {
    mrpTotal: number;
    payableTotal: number;
    savings: number;
};

export type PricedItem = {
    price: number;
    discountPercent: number;
    quantity: number;
};