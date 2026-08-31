import { DomainEvent } from "./domainEvent";
import { Order } from "./order";

export type POSItemInput = {
    productId: string;
    quantity: number;
};

export type POSInput = {
    tenantId: string;
    staffId: string;
    items: POSItemInput[];
};

export type RemovedPOSItem = {
    productId: string;
    reason: "INACTIVE" | "NOT_PROVISIONED";
};

export type POSResult =
    | {
        success: true;
        order: Order & {
            placedByStaffId: string;
        };
        events: DomainEvent[];
    }
    | {
        success: false;
        removedItems: RemovedPOSItem[];
    };

export type POSResponse =
    | {
        order: Order & {
            placedByStaffId: string;
        };
    }
    | {
        removedItems: RemovedPOSItem[];
    };

export type CreatePOSOrderDTO = {
    items: POSItemInput[];
};