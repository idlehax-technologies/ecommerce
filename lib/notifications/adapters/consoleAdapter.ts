import type { Notification } from "@/types/notification";

export async function sendConsoleNotification(
    n: Notification
): Promise<void> {
    console.log("📢 Notification:", {
        tenantId: n.tenantId,
        userId: n.userId,
        title: n.title,
        message: n.message,
        reference: n.reference,
        createdAt: n.createdAt,
    });
}