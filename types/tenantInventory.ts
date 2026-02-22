export type TenantInventory = {
    tenantId: string;
    productId: string;

    enabled: boolean;
    stock: number;

    createdAt: string;
    updatedAt: string;
};

export type ProvisionProductDTO = {
    productId: string;
    enabled: boolean;
    stock: number;
};
