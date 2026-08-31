import { Order } from "./order";
import { DomainEvent } from "./domainEvent";

export type RemovedCartItem = {
    productId: string;
    reason: "INACTIVE" | "NOT_PROVISIONED";
};

export type CheckoutResult =
    | {
        success: true;
        order: Order;
        event: DomainEvent;
    }
    | {
        success: false;
        removedItems: RemovedCartItem[];
    };

export type CheckoutResponse =
    | {
        order: Order;
    }
    | {
        removedItems: RemovedCartItem[];
    };