"use client";

import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Button,
} from "@mui/material";

import { useAuth } from "@/contexts/AuthContext";
import { useSnackbar } from "@/contexts/SnackbarContext";

type OtpResendProps = {
    phone: string;
    resendDelay?: number;
};

export default function OtpResend({
    phone,
    resendDelay = 30,
}: OtpResendProps) {

    const { requestOtp } = useAuth();
    const { show } = useSnackbar();

    const [secondsLeft, setSecondsLeft] = useState(resendDelay);
    const [requestingOtp, setRequestingOtp] = useState(false);

    useEffect(() => {
        setSecondsLeft(resendDelay);
    }, [phone, resendDelay]);

    useEffect(() => {
        if (secondsLeft === 0) {
            return;
        }

        const timer = window.setTimeout(() => {
            setSecondsLeft((seconds) => seconds - 1);
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [secondsLeft]);

    const handleResend = async () => {
        setRequestingOtp(true);

        try {
            await requestOtp(phone);
            show("OTP resent to WhatsApp");
            setSecondsLeft(resendDelay);

        } catch (err: unknown) {
            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Failed to resend OTP, please try again", "error");
            }

        } finally {
            setRequestingOtp(false);
        }
    };

    return (
        <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
        >
            <Box
                component="span"
                sx={{ fontWeight: 600 }}
            >
                Didn&apos;t receive the code?
            </Box>{" "}

            {secondsLeft > 0 ? (
                <>
                    Resend{"\u00A0"}OTP{"\u00A0"}in{"\u00A0"}{secondsLeft}s
                </>
            ) : (
                <Button
                    variant="text"
                    onClick={handleResend}
                    disabled={requestingOtp}
                    sx={{
                        minWidth: 0,
                        p: 0,
                        verticalAlign: "baseline",
                    }}
                >
                    Resend OTP
                </Button>
            )}
        </Typography>
    );
}