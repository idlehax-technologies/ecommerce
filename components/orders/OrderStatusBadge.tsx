"use client";

import { Chip } from "@mui/material";
import type { OrderStatus } from "@/types/order";

export default function OrderStatusBadge({
    status,
}: {
    status: OrderStatus;
}) {
    const map = {
        RESERVED: { label: "Reserved", color: "info" as const },
        PAID: { label: "Paid", color: "success" as const },
        PICKED_UP: { label: "Picked Up", color: "success" as const },
        CANCELLED: { label: "Cancelled", color: "error" as const },
        EXPIRED: { label: "Expired", color: "warning" as const },
        REFUNDED: { label: "Refunded", color: "default" as const },
    };

    const cfg = map[status];
    return <Chip size="small" label={cfg.label} color={cfg.color} />;
}