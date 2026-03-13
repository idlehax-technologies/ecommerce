import type { Cart } from "@/types/cart";
import { CheckoutInvalidInputError } from "./errors";

export function requireCartNotEmpty(cart: Cart) {
    if (!cart.items.length) {
        throw new CheckoutInvalidInputError("Cart is empty");
    }
}