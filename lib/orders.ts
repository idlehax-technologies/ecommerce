import type { Order } from "@/types/order";

export const orders: Order[] = [
  {
    orderId: "ORD_1001",
    items: [
      { productId: 1, vendorId: "v1", name: "Shoes", price: 999, quantity: 1 },
      { productId: 2, vendorId: "v2", name: "T-Shirt", price: 499, quantity: 2 },
    ],
    total: 999 + 499 * 2,
    currency: "INR",
    status: "SUCCESS",
    createdAt: "2026-01-01T10:15:00Z",
  },
  {
    orderId: "ORD_1002",
    items: [
      { productId: 3, vendorId: "v1", name: "Backpack", price: 1499, quantity: 1 },
    ],
    total: 1499,
    currency: "INR",
    status: "FAILED",
    createdAt: "2026-01-03T14:40:00Z",
  },
  {
    orderId: "ORD_1003",
    items: [
      { productId: 4, vendorId: "v3", name: "Headphones", price: 1999, quantity: 1 },
      { productId: 5, vendorId: "v2", name: "Cap", price: 299, quantity: 1 },
    ],
    total: 1999 + 299,
    currency: "INR",
    status: "SUCCESS",
    createdAt: "2026-01-05T09:05:00Z",
  },
  {
    orderId: "ORD_1004",
    items: [
      { productId: 6, vendorId: "v4", name: "Notebook", price: 199, quantity: 3 },
    ],
    total: 199 * 3,
    currency: "INR",
    status: "PENDING",
    createdAt: "2026-01-07T18:20:00Z",
  },
  {
    orderId: "ORD_1005",
    items: [
      { productId: 7, vendorId: "v1", name: "Watch", price: 2999, quantity: 1 },
    ],
    total: 2999,
    currency: "INR",
    status: "SUCCESS",
    createdAt: "2026-01-10T11:55:00Z",
  },
];
