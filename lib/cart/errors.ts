export abstract class CartDomainError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

/* =========================================================
   Domain invariant errors
   ========================================================= */

export class CrossTenantCartError extends CartDomainError {
    constructor(message = "Cannot mix products from different tenants") {
        super(message, 409);
    }
}

export class CartItemNotFoundError extends CartDomainError {
    constructor(message = "Item not found in cart") {
        super(message, 404);
    }
}

/* =========================================================
   Input validation errors (DTO shape failures)
   ========================================================= */

export class InvalidCartRequestError extends CartDomainError {
    constructor(message = "Invalid cart request body") {
        super(message, 400);
    }
}

export class InvalidProductIdError extends CartDomainError {
    constructor(message = "Invalid productId") {
        super(message, 400);
    }
}

export class InvalidQuantityError extends CartDomainError {
    constructor(message = "Invalid quantity") {
        super(message, 400);
    }
}
