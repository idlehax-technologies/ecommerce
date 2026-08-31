"use client";

import { useState } from "react";

import { Stack } from "@mui/material";

import AuthCard from "./AuthCard";
import OtpHeader from "./OtpHeader";
import OtpInput from "./OtpInput";
import OtpResend from "./OtpResend";
import OtpFooter from "./OtpFooter";

import { useAuth } from "@/contexts/AuthContext";
import { useSnackbar } from "@/contexts/SnackbarContext";

type OtpVerifyFormProps = {
    phone: string;
    onBack: () => void;
    resendDelay?: number;
};

export default function OtpVerifyForm({
    phone,
    onBack,
    resendDelay = 30,
}: OtpVerifyFormProps) {

    const { verifyOtp } = useAuth();
    const { show } = useSnackbar();

    const [code, setCode] = useState("");
    const [focusKey, setFocusKey] = useState(0);
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const handleVerify = async (code: string) => {
        if (code.length !== 6) {
            return;
        }

        setVerifyingOtp(true);

        try {
            await verifyOtp(phone, code);

        } catch (err: unknown) {
            setCode("");
            setFocusKey((key) => key + 1);

            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Something went wrong, please try again", "error");
            }

        } finally {
            setVerifyingOtp(false);
        }
    };

    return (
        <AuthCard
            title="OTP Verification"
            subtitle={`Enter the 6-digit code sent via WhatsApp to +91\u00A0${phone}`}
            headerStart={
                <OtpHeader
                    onBack={onBack}
                />
            }
        >
            <OtpInput
                value={code}
                disabled={verifyingOtp}
                focusKey={focusKey}
                onChange={(value) => {
                    setCode(value);
                }}
                onComplete={handleVerify}
            />

            <Stack
                spacing={0.75}
                alignItems="center"
            >
                <OtpResend
                    phone={phone}
                    resendDelay={resendDelay}
                />

                <OtpFooter />
            </Stack>
        </AuthCard>
    );
}
