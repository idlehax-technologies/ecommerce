export type CartItem = {
    productId: number;
    vendorId: string;
    name: string;
    price: number;
    quantity: number;
};

export type AddToCartInput = {
    productId: number;
    vendorId: string;
    name: string;
    price: number;
};

export type CartContextType = {
    items: CartItem[];
    addToCart: (product: AddToCartInput) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;

    placeOrder: () => void;
    failOrder: () => void;
    resetOrderState: () => void;

    orderAttempted: boolean;
    orderPlaced: boolean;
};
