export type CheckoutItem = {
  productId: string;
  quantity: number;
};

export type CheckoutRequest = {
  items: CheckoutItem[];
};

export type CheckoutInput = {
  userId: string;
  tenantId: string;
  items: CheckoutItem[];
};