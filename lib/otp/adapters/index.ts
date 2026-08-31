import { sendMetaOtp } from "./metaAdapter";
import { sendConsoleOtp } from "./consoleAdapter";

export const sendOtp =
    process.env.NODE_ENV === "production"
        ? sendMetaOtp
        : sendConsoleOtp;