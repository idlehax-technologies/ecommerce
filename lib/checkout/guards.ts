import type { Cart } from "@/types/cart";
import { CheckoutCartEmptyError, CheckoutInvalidInputError } from "./errors";

export function requireCartNotEmpty(cart: Cart) {
    if (!cart.items.length) {
        throw new CheckoutCartEmptyError();
    }
}