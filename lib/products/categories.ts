export const PRODUCT_CATEGORIES = [
    {
        code: "STA",
        name: "Stationery",
    },
    {
        code: "AUD",
        name: "Audio",
    },
    {
        code: "STO",
        name: "Storage",
    },
    {
        code: "WRK",
        name: "Workspace",
    },
] as const;

export type ProductCategory =
    typeof PRODUCT_CATEGORIES[number]["name"];

export function getCategoryCode(
    category: ProductCategory
): string {
    const match = PRODUCT_CATEGORIES.find(
        (c) => c.name === category
    );

    if (!match) {
        throw new Error(
            `Unknown product category: ${category}`
        );
    }

    return match.code;
}