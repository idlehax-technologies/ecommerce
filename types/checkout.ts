export type CheckoutItem = {
  productId: string;
  quantity: number;
};

export type CheckoutRequest = {
  items: CheckoutItem[];
};