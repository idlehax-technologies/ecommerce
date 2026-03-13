import { Stack } from "@mui/material";
import type { OrderItem } from "@/types/order";
import OrderItemRow from "./OrderItemRow";

export default function OrderItemsList({
    items,
}: {
    items: OrderItem[];
}) {
    return (
        <Stack spacing={2}>
            {items.map((item) => (
                <OrderItemRow key={item.productId} item={item} />
            ))}
        </Stack>
    );
}