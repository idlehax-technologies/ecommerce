import type { Order } from "./order";
import type { Payment } from "./payment";
import type { Membership } from "./membership";

export type DomainEvent =
    | { type: "OrderCreated"; order: Order }
    | { type: "OrderPaid"; order: Order; from: Order["status"]; to: Order["status"] }
    | { type: "OrderCancelled"; order: Order; from: Order["status"]; to: Order["status"] }
    | { type: "OrderExpired"; order: Order; from: Order["status"]; to: Order["status"] }
    | { type: "OrderPickedUp"; order: Order; from: Order["status"]; to: Order["status"] }
    | { type: "OrderRefunded"; order: Order; from: Order["status"]; to: Order["status"] }

    | { type: "MembershipRequested"; membership: Membership }
    | { type: "MembershipApproved"; membership: Membership; from: Membership["status"]; to: Membership["status"] }
    | { type: "MembershipRejected"; membership: Membership; from: Membership["status"]; to: Membership["status"] }
    | { type: "MembershipRevoked"; membership: Membership; from: Membership["status"]; to: Membership["status"] }
    | { type: "MembershipExpired"; membership: Membership; from: Membership["status"]; to: Membership["status"] }
    | { type: "MembershipRoleUpdated"; membership: Membership; from: Membership["role"]; to: Membership["role"] }

    | { type: "PaymentConfirmed"; order: Order; payment: Payment }

    | {
        type: "InventoryAdjusted";
        tenantId: string;
        productId: string;
        from: { stock: number; reserved: number };
        to: { stock: number; reserved: number };
    };