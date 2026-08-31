import type { Notification } from "@/types/notification";
import { sendConsoleNotification } from "./consoleAdapter";

export async function deliverNotification(n: Notification): Promise<void> {
    switch (n.channel) {
        case "CONSOLE":
            return sendConsoleNotification(n);

        case "EMAIL":
            // future adapter
            return sendConsoleNotification(n);

        default:
            return;
    }
}