"use client";

import { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import OtpVerifyForm from "./OtpVerifyForm";

export default function PhoneLoginForm() {
    const { requestOtp } = useAuth();
    const [phone, setPhone] = useState("");
    const [sent, setSent] = useState(false);

    const send = async () => {
        await requestOtp(phone);
        setSent(true);
    };

    if (sent) return <OtpVerifyForm phone={phone} />;

    return (
        <Box maxWidth={400} mx="auto" mt={8}>
            <TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Button fullWidth sx={{ mt: 2 }} variant="contained" onClick={send}>
                Send OTP
            </Button>
        </Box>
    );
}
