// lib/orders.ts

import type { Order } from "@/types/order";

/*
  Dev-only in-memory sample data
  Matches current tenant + POS + pickup model
*/

export const orders: Order[] = [
  {
    orderId: "ORD_2001",

    tenantId: "school-a",
    userId: "user-101",

    items: [
      {
        productId: "p-notebook-001",
        name: "Classmate Notebook (200 pages)",
        price: 5000,
        quantity: 2,
      },
    ],

    total: 10000,
    currency: "INR",

    paymentMode: "DIGITAL",
    status: "PICKED_UP",

    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-02-01T09:10:00Z",
  },

  {
    orderId: "ORD_2002",

    tenantId: "school-a",
    userId: "user-102",

    items: [
      {
        productId: "p-geometry-002",
        name: "Geometry Box – Metal",
        price: 8500,
        quantity: 1,
      },
    ],

    total: 8500,
    currency: "INR",

    paymentMode: "CASH",
    status: "PAID",

    createdAt: "2026-02-02T11:30:00Z",
    updatedAt: "2026-02-02T11:35:00Z",
  },

  {
    orderId: "ORD_2003",

    tenantId: "school-b",
    userId: "user-201",

    items: [
      {
        productId: "p-notebook-001",
        name: "Classmate Notebook (200 pages)",
        price: 5000,
        quantity: 3,
      },
    ],

    total: 15000,
    currency: "INR",

    paymentMode: "DIGITAL",
    status: "RESERVED",

    createdAt: "2026-02-03T14:00:00Z",
    updatedAt: "2026-02-03T14:00:00Z",
  },
];
