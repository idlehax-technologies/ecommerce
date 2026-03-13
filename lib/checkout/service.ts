import * as cartDomain from "@/lib/cart/domain";
import * as ordersDomain from "@/lib/orders/domain";
import { reserveStock } from "@/lib/tenantInventory/domain";
import { cartItemToOrderItem } from "@/lib/orders/mappers";
import { requireCartNotEmpty } from "./guards";
import type { CheckoutInput } from "@/types/checkout";

export async function executeCheckout(input: CheckoutInput) {

    const actor = { tenantId: input.tenantId } as any

    const cart = cartDomain.getCart(actor)

    requireCartNotEmpty(cart)

    const orderItems = cart.items.map(cartItemToOrderItem)

    const order = ordersDomain.createOrder(
        input.tenantId,
        input.userId,
        orderItems
    )

    for (const item of order.items) {
        reserveStock(input.tenantId, item.productId, item.quantity)
    }

    cartDomain.clearCart(actor)

    return order
}