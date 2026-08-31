export const GST_RATES = [
    0,
    0.1,
    0.25,
    0.5,
    1,
    1.5,
    3,
    5,
    6,
    7.5,
    12,
    18,
    28,
    40,
] as const;

export type GstRate =
    typeof GST_RATES[number];