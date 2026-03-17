import type { TenantInventory } from "@/types/tenantInventory";
import { OutOfStockError, ReservationStateError } from "./errors";

export function getAvailableStock(record: TenantInventory): number {
    return record.stock - record.reserved;
}

export function applyReservation(
    record: TenantInventory,
    quantity: number
): TenantInventory {

    const available = getAvailableStock(record);

    if (available < quantity) {
        throw new OutOfStockError(record.productId);
    }

    return {
        ...record,
        reserved: record.reserved + quantity,
        updatedAt: new Date().toISOString(),
    };
}

export function commitReservation(
    record: TenantInventory,
    quantity: number
): TenantInventory {

    if (record.reserved < quantity) {
        throw new ReservationStateError(
            "Cannot commit reservation larger than reserved quantity"
        );
    }

    return {
        ...record,
        reserved: record.reserved - quantity,
        stock: record.stock - quantity,
        updatedAt: new Date().toISOString(),
    };
}

export function releaseReservation(
    record: TenantInventory,
    quantity: number
): TenantInventory {

    if (record.reserved < quantity) {
        throw new ReservationStateError(
            "Cannot release reservation larger than reserved quantity"
        );
    }

    return {
        ...record,
        reserved: record.reserved - quantity,
        updatedAt: new Date().toISOString(),
    };
}