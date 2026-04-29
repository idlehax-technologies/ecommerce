export type NotificationChannel = "CONSOLE" | "EMAIL";

export type Notification = {
    notificationId: string;

    tenantId: string;
    userId: string;

    channel: NotificationChannel;

    title: string;
    message: string;

    // 🔴 NEW
    reference?: {
        type: "ORDER" | "MEMBERSHIP";
        id: string;
    };

    createdAt: string;
};