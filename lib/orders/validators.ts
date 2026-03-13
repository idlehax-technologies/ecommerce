export function assertOrderId(id: string) {
    if (!id || typeof id !== "string") {
        throw new Error("Invalid orderId");
    }
}