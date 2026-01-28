export type CheckoutItem = {
  productId: number;
  vendorId: string;
  quantity: number;
};

export type CheckoutRequest = {
  items: CheckoutItem[];
  total: number;
  currency: "INR";
};

export type CheckoutSuccessResponse = {
  success: true;
  orderId: string;
  message: string;
};

export type CheckoutFailureResponse = {
  success: false;
  errorCode: string;
  message: string;
};

export type CheckoutResponse =
  | CheckoutSuccessResponse
  | CheckoutFailureResponse;
