import {
    createProduct,
    listProducts,
    getProduct,
    updateProduct,
    activateProduct,
    deactivateProduct,
} from "./domain";

import type {
    Product,
    CreateProductDTO,
    UpdateProductDTO,
} from "@/types/product";

export async function listPlatformProducts(
    limit?: number
): Promise<Product[]> {
    return listProducts(limit);
}

export async function createPlatformProduct(
    dto: CreateProductDTO
): Promise<Product> {
    return createProduct(dto);
}

export async function getPlatformProduct(
    productId: string
): Promise<Product> {
    return getProduct(productId);
}

export async function updatePlatformProduct(
    productId: string,
    dto: UpdateProductDTO
): Promise<Product> {
    return updateProduct(productId, dto);
}

export async function activatePlatformProduct(
    productId: string
): Promise<Product> {
    return activateProduct(productId);
}

export async function deactivatePlatformProduct(
    productId: string
): Promise<Product> {
    return deactivateProduct(productId);
}