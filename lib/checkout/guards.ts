import type { Cart } from "@/types/cart";
import { CheckoutCartEmptyError } from "./errors";

export function requireCartNotEmpty(cart: Cart) {
    if (!cart.items.length) {
        throw new CheckoutCartEmptyError();
    }
}