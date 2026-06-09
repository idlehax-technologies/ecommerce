import type { UserProfile } from "@/types/profile";
import type { Tenant } from "@/types/tenant";
import type { Product } from "@/types/product";

import type {
    SellerSnapshot,
    CustomerSnapshot,
    ItemSnapshot,
} from "@/types/order";

export function toSellerSnapshot(
    tenant: Tenant
): SellerSnapshot {
    return {
        name: tenant.name,
        address: tenant.address,
        state: tenant.state,
        gstin: tenant.gstin,
    };
}

export function toCustomerSnapshot(
    profile: UserProfile
): CustomerSnapshot {
    return {
        fullName: profile.fullName,
        phone: profile.phone,
        email: profile.email,
        addressText: profile.addressText,
    };
}

export function toItemSnapshot(
    product: Product,
    quantity: number
): ItemSnapshot {
    return {
        productId: product.productId,
        sku: product.sku,

        title: product.title,
        description: product.description,

        hsnCode: product.hsnCode,
        gstRate: product.gstRate,

        price: product.price,
        quantity,
    };
}