import type { Product } from "@/types/product";
import { prisma } from "@/lib/db/prisma";

export const productStore = {
    async get(productId: string): Promise<Product | undefined> {
        const product = await prisma.product.findUnique({
            where: { productId },
        });

        if (!product) {
            return undefined;
        }

        return {
            productId: product.productId,
            sku: product.sku,
            title: product.title,
            description: product.description,
            price: product.price,
            discountPercent: product.discountPercent,
            currency: product.currency as Product["currency"],
            hsnCode: product.hsnCode,
            gstRate: Number(product.gstRate) as Product["gstRate"],
            status: product.status,
            images: product.images,
            category: product.category as Product["category"],
            tags: product.tags,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
        };
    },

    async getAll(): Promise<Product[]> {
        const products = await prisma.product.findMany();

        return products.map((product) => ({
            productId: product.productId,
            sku: product.sku,
            title: product.title,
            description: product.description,
            price: product.price,
            discountPercent: product.discountPercent,
            currency: product.currency as Product["currency"],
            hsnCode: product.hsnCode,
            gstRate: Number(product.gstRate) as Product["gstRate"],
            status: product.status,
            images: product.images,
            category: product.category as Product["category"],
            tags: product.tags,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
        }));
    },

    async save(product: Product): Promise<void> {
        await prisma.product.upsert({
            where: {
                productId: product.productId,
            },
            create: {
                productId: product.productId,
                sku: product.sku,
                title: product.title,
                description: product.description,
                price: product.price,
                discountPercent: product.discountPercent,
                currency: product.currency,
                hsnCode: product.hsnCode,
                gstRate: product.gstRate,
                status: product.status,
                images: product.images,
                category: product.category,
                tags: product.tags,
                createdAt: new Date(product.createdAt),
                updatedAt: new Date(product.updatedAt),
            },
            update: {
                title: product.title,
                description: product.description,
                price: product.price,
                discountPercent: product.discountPercent,
                hsnCode: product.hsnCode,
                gstRate: product.gstRate,
                status: product.status,
                images: product.images,
                category: product.category,
                tags: product.tags,
                updatedAt: new Date(product.updatedAt),
            },
        });
    },
};