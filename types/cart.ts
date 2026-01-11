export type CartItemType = {
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
    items: CartItemType[];
    addToCart: (product: AddToCartInput) => void;
    removeFromCart: (productId: number) => void;
    increaseQuantity: (productId: number) => void;
    decreaseQuantity: (productId: number) => void;
    clearCart: () => void;

    placeOrder: () => void;
    failOrder: () => void;

    resetOrderState: () => void;
    orderAttempted: boolean;
    orderPlaced: boolean;

    startPendingRemove: (productId: number) => void;
    stopPendingRemove: () => void;
    pendingRemove: {
        productId: number;
        timeoutId: NodeJS.Timeout;
    } | null;
};
