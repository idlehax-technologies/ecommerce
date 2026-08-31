"use client";

import { useState } from "react";

import {
    Stack,
    TextField,
    Button,
    InputAdornment,
    CircularProgress,
} from "@mui/material";

import { useAuth } from "@/contexts/AuthContext";
import { useSnackbar } from "@/contexts/SnackbarContext";

import AuthCard from "./AuthCard";
import OtpVerifyForm from "./OtpVerifyForm";

export default function PhoneLoginForm() {

    const { requestOtp } = useAuth();
    const { show } = useSnackbar();

    const [phone, setPhone] = useState("");
    const [requestingOtp, setRequestingOtp] = useState(false);
    const [showOtp, setShowOtp] = useState(false);

    const handlePhoneChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const digits = event.target.value
            .replace(/\D/g, "")
            .slice(0, 10);

        setPhone(digits);
    };

    const handleContinue = async () => {
        if (phone.length !== 10) {
            return;
        }

        setRequestingOtp(true);

        try {
            await requestOtp(phone);
            show("OTP sent to WhatsApp");
            setShowOtp(true);

        } catch (err: unknown) {
            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Failed to send OTP, please try again", "error");
            }

        } finally {
            setRequestingOtp(false);
        }
    };

    if (showOtp) {
        return (
            <OtpVerifyForm
                phone={phone}
                onBack={() => {
                    setShowOtp(false);
                }}
            />
        );
    }

    return (
        <AuthCard
            title="Shopping made simple"
            subtitle="Log in or Sign up"
        >
            <Stack
                spacing={{
                    xs: 1.5,
                    sm: 2,
                }}
            >
                <TextField
                    fullWidth
                    label="WhatsApp Number"
                    value={phone}
                    onChange={handlePhoneChange}
                    disabled={requestingOtp}
                    slotProps={{
                        htmlInput: {
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            maxLength: 10,
                        },
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    +91
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleContinue}
                    disabled={
                        requestingOtp ||
                        phone.length !== 10
                    }
                    startIcon={
                        requestingOtp ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        ) : undefined
                    }
                >
                    Continue
                </Button>
            </Stack>
        </AuthCard>
    );
}
