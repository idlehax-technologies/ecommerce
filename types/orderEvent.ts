import type { Order } from "./order";

export type OrderEvent =
    | { type: "OrderCreated"; order: Order }
    | { type: "OrderPaid"; order: Order }
    | { type: "OrderCancelled"; order: Order }
    | { type: "OrderExpired"; order: Order }
    | { type: "OrderPickedUp"; order: Order };