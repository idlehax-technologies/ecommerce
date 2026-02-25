import {
    createProduct as createDomainProduct,
    listProducts as listDomainProducts,
    getProduct as getDomainProduct,
    updateProduct as updateDomainProduct,
    softDeleteProduct as softDeleteDomainProduct,
} from "./domain";

import type {
    Product,
    CreateProductDTO,
    UpdateProductDTO,
} from "@/types/product";

import { toProductUpdateChanges } from "./mappers";

export async function listProductsForPlatform(): Promise<Product[]> {
    return listDomainProducts();
}

export async function createPlatformProduct(
    dto: CreateProductDTO
): Promise<Product> {
    return createDomainProduct(dto);
}

export async function getPlatformProduct(
    productId: string
): Promise<Product> {
    return getDomainProduct(productId);
}

export async function updatePlatformProduct(
    productId: string,
    dto: UpdateProductDTO
): Promise<Product> {
    const changes = toProductUpdateChanges(dto);
    return updateDomainProduct(productId, changes);
}

export async function deletePlatformProduct(
    productId: string
): Promise<void> {
    return softDeleteDomainProduct(productId);
}