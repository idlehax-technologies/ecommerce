export type CreateProductDTO = {
    title: string;
    description?: string;
    price: number;
    stock: number;
    sku?: string;
    images?: string[];
    category?: string;
    tags?: string[];
};

export type UpdateProductDTO = Partial<CreateProductDTO>;
