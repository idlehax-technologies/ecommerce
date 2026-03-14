export function assertOrderId(id: string) {
    if (!id || typeof id !== "string") {
        throw new Error("Invalid orderId");
    }
}

export function assertOrderItemsShape(items: unknown) {
    if (!Array.isArray(items)) {
        throw new Error("Invalid order items");
    }
}