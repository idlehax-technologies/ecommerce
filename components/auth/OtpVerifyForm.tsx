"use client";

import { useState } from "react";
import { Button, TextField, Box, Alert } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function OtpVerifyForm({ phone }: { phone: string }) {
    const { verifyOtp } = useAuth();
    const router = useRouter();

    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const handleVerify = async () => {
        try {
            await verifyOtp(phone, code);
            router.replace("/home");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to verify OTP");
            }
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={8}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
                fullWidth
                label="OTP"
                value={code}
                onChange={(e) => {
                    setCode(e.target.value);
                    setError("");
                }}
            />

            <Button fullWidth sx={{ mt: 2 }} variant="contained" onClick={handleVerify}>
                Verify
            </Button>
        </Box>
    );
}
