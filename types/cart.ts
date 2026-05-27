export type CartItem = {
    productId: string;
    title: string;
    price: number; // paise
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

export type CartContextValue = {
    cart: Cart | null;
    refresh: () => Promise<void>;
    add: (id: string) => Promise<void>;
    update: (id: string, q: number) => Promise<void>;
    remove: (id: string) => Promise<void>;
    clear: () => Promise<void>;
};