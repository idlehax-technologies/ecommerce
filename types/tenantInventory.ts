export type TenantInventory = {
    tenantId: string;
    productId: string;

    enabled: boolean;

    /**
     * Physical stock owned by tenant
     */
    stock: number;

    /**
     * Quantity currently reserved by open orders
     */
    reserved: number;

    createdAt: string;
    updatedAt: string;
};

export type ProvisionProductDTO = {
    productId: string;
    enabled: boolean;
    stock: number;
};