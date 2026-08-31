export const PRODUCT_CATEGORIES = [
    {
        code: "BOOK",
        name: "Books & Learning Resources",
    },
    {
        code: "OFFI",
        name: "Stationery & Office Supplies",
    },
    {
        code: "LABS",
        name: "Lab Equipment & Supplies",
    },
    {
        code: "ELEC",
        name: "Electronics & Smart Tech",
    },
    {
        code: "DIGI",
        name: "Digital Products & Services",
    },
    {
        code: "WEAR",
        name: "Apparel & Uniforms",
    },
    {
        code: "SPRT",
        name: "Sports, Fitness & Outdoor",
    },
    {
        code: "HLTH",
        name: "Health, Safety & Hygiene",
    },
    {
        code: "FURN",
        name: "Furniture & Fixtures",
    },
    {
        code: "HARD",
        name: "Industrial, Tools & Hardware",
    },
    {
        code: "OTHR",
        name: "Other / General Store",
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