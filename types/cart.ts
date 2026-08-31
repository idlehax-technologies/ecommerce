export type CartItem = {
    productId: string;
    quantity: number;
};

export type Cart = {
    tenantId: string;
    userId: string;
    items: CartItem[];
    updatedAt: string;
};

export type AddToCartDTO = {
    productId: string;
    quantity?: number;
};

export type UpdateCartItemDTO = {
    quantity: number;
};