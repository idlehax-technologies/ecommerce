import { Order } from "@/types/order";

const globalForOrders = globalThis as any;

const store: Map<string, Order> =
    globalForOrders.orders ?? new Map();

globalForOrders.orders = store;

export const orderStore = {
    save(o: Order) {
        store.set(o.orderId, o);
    },

    get(id: string): Order | undefined {
        return store.get(id);
    },

    getByUser(userId: string): Order[] {
        return Array.from(store.values()).filter(o => o.userId === userId);
    }
};
