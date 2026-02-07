// ================================
// Transport (client → server)
// ================================

export type CheckoutItem = {
  productId: string;
  quantity: number;
};

export type CheckoutRequest = {
  items: CheckoutItem[];
};


// ================================
// Domain (internal use only)
// ================================

export type CheckoutInput = {
  userId: string;
  tenantId?: string;
  items: CheckoutItem[];
};


// ================================
// Responses
// ================================

export type CheckoutSuccessResponse = {
  success: true;
  orderId: string;
  message: string;
};

export type CheckoutFailureResponse = {
  success: false;
  errorCode:
  | "UNAUTHORIZED"
  | "INVALID_INPUT"
  | "PRODUCT_NOT_FOUND"
  | "OUT_OF_STOCK"
  | "CHECKOUT_FAILED"
  | "SERVER_ERROR";
  message: string;
};

export type CheckoutResponse =
  | CheckoutSuccessResponse
  | CheckoutFailureResponse;
