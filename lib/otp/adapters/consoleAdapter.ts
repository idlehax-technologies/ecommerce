import { OtpCode } from "@/types/otp";

export async function sendConsoleOtp(
    message: OtpCode
): Promise<void> {
    console.log("🔐 OTP:", {
        phone: message.phone,
        code: message.code,
    });
}