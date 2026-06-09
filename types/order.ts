import { IndianState } from "@/lib/tenants/states";
import { GstRate } from "@/lib/products/gst";
import { PaymentMethod } from "./payment";

export type OrderStatus =
    | "RESERVED"
    | "PAID"
    | "PICKED_UP"
    | "CANCELLED"
    | "EXPIRED"
    | "REFUNDED";

export type SellerSnapshot = {
    name: string;
    address: string;
    state: IndianState;
    gstin?: string;
};

export type CustomerSnapshot = {
    fullName: string;
    phone: string;
    email: string;
    addressText: string;
};

export type ItemSnapshot = {
    productId: string;
    sku: string;
    title: string;
    description: string;
    hsnCode: string;
    gstRate: GstRate;
    price: number; // snapshot, incl. GST, in paise
    quantity: number;
};

export type Order = {
    orderId: string;
    orderNumber: string;

    tenantId: string;
    userId: string;

    seller: SellerSnapshot;
    customer: CustomerSnapshot;

    placedByStaffId?: string;

    items: ItemSnapshot[];

    total: number;
    currency: "INR";

    paymentMethod?: PaymentMethod;

    invoiceNumber?: string;
    invoiceIssuedAt?: string;

    status: OrderStatus;

    createdAt: string;
    updatedAt: string;
};

export type CreatePOSOrderDTO = {
    items: {
        productId: string;
        quantity: number;
    }[];
    paymentMethod?: PaymentMethod;
};

export type OrderListItem = Pick<
    Order,
    | "orderId"
    | "orderNumber"
    | "invoiceNumber"
    | "total"
    | "status"
    | "createdAt"
>;