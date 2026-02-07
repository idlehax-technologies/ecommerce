export type CartItemType = {
    productId: string;   // consistent with domain

    name: string;        // display only
    price: number;       // display only
    quantity: number;
};

export type AddToCartInput = {
    productId: string;

    name: string;
    price: number;
};

export type CartContextType = {
    items: CartItemType[];
    addToCart: (product: AddToCartInput) => void;
    removeFromCart: (productId: string) => void;
    increaseQuantity: (productId: string) => void;
    decreaseQuantity: (productId: string) => void;
    clearCart: () => void;

    placeOrder: () => void;
    failOrder: () => void;

    resetOrderState: () => void;
    orderAttempted: boolean;
    orderPlaced: boolean;

    startPendingRemove: (productId: string) => void;
    stopPendingRemove: () => void;
    pendingRemove: {
        productId: string;
        timeoutId: NodeJS.Timeout;
    } | null;
};
