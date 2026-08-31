import type { Payment } from "@/types/payment";
import { prisma } from "@/lib/db/prisma";

export const paymentStore = {
    async listByTenant(tenantId: string): Promise<Payment[]> {

        const payments =
            await prisma.payment.findMany({
                where: { tenantId },
            });

        return payments.map((payment) => ({
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            tenantId: payment.tenantId,
            amount: payment.amount,
            currency: payment.currency as "INR",
            method: payment.method,
            status: payment.status,
            createdAt: payment.createdAt.toISOString(),
            updatedAt: payment.updatedAt.toISOString(),
        }));
    },

    async getByOrder(orderId: string): Promise<Payment | null> {

        const payment =
            await prisma.payment.findUnique({
                where: { orderId },
            });

        if (!payment) {
            return null;
        }

        return {
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            tenantId: payment.tenantId,
            amount: payment.amount,
            currency: payment.currency as "INR",
            method: payment.method,
            status: payment.status,
            createdAt: payment.createdAt.toISOString(),
            updatedAt: payment.updatedAt.toISOString(),
        };
    },

    async save(payment: Payment): Promise<void> {

        await prisma.payment.create({
            data: {
                paymentId: payment.paymentId,
                orderId: payment.orderId,
                tenantId: payment.tenantId,
                amount: payment.amount,
                currency: payment.currency,
                method: payment.method,
                status: payment.status,
                createdAt: new Date(payment.createdAt),
                updatedAt: new Date(payment.updatedAt),
            },
        });
    },

    async update(payment: Payment): Promise<void> {

        await prisma.payment.update({
            where: {
                paymentId: payment.paymentId,
            },
            data: {
                status: payment.status,
                updatedAt: new Date(payment.updatedAt),
            },
        });
    },
};