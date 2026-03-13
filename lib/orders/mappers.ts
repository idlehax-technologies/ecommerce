import type { CartItem } from "@/types/cart";
import type { OrderItem } from "@/types/order";

export function cartItemToOrderItem(item: CartItem): OrderItem {
    return {
        productId: item.productId,
        name: item.title,
        price: item.price,
        quantity: item.quantity,
    };
}