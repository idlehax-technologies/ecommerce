import { Stack } from "@mui/material";
import type { ItemSnapshot } from "@/types/order";
import OrderItemRow from "./OrderItemRow";

export default function OrderItemsList({
    items,
}: {
    items: ItemSnapshot[];
}) {
    return (
        <Stack spacing={2}>
            {items.map((item) => (
                <OrderItemRow key={item.productId} item={item} />
            ))}
        </Stack>
    );
}