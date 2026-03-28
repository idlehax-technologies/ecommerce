import type { Order } from "./order";
import type { Payment } from "./payment";

export type OrderEvent =
    | { type: "OrderCreated"; order: Order }
    | { type: "OrderPaid"; order: Order; payment: Payment }
    | { type: "OrderCancelled"; order: Order }
    | { type: "OrderExpired"; order: Order }
    | { type: "OrderPickedUp"; order: Order }
    | { type: "OrderRefunded"; order: Order }; // ✅ NEW