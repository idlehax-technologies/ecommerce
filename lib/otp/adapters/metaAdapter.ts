import { OtpCode } from "@/types/otp";

import { otpConfig } from "../config";
import { buildOtpTemplate } from "../templates";

import { OtpDeliveryFailedError } from "@/lib/auth/errors";

export async function sendMetaOtp(
    message: OtpCode
): Promise<void> {
    let response: Response;

    try {
        response = await fetch(
            `https://graph.facebook.com/${otpConfig.graphVersion}/${otpConfig.phoneNumberId}/messages`,
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${otpConfig.accessToken}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    to: `91${message.phone}`,
                    ...buildOtpTemplate(message.code),
                }),
            }
        );
    } catch (err: unknown) {
        throw new OtpDeliveryFailedError(
            err instanceof Error
                ? err.message
                : "Failed to reach Meta Cloud API"
        );
    }

    if (response.ok) {
        return;
    }

    const errorBody = await response
        .json()
        .catch(() => null);

    const details =
        errorBody?.error?.message ??
        `Meta Cloud API returned HTTP ${response.status} ${response.statusText}`;

    throw new OtpDeliveryFailedError(details);
}