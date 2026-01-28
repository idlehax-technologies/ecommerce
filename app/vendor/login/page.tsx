"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import Link from "next/link";

export default function VendorLoginpage() {
    const { user, login, loading, error } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showRedirectMsg, setShowRedirectMsg] = useState(false);


    // useEffect(() => {
    //     if (loading) return;
    //     if (showRedirectMsg) return;
    //     if (user) {
    //         router.replace(user.role === "vendor" ? "/vendor/dashboard" : "/");
    //     }
    // }, [loading, showRedirectMsg, user]);


    useEffect(() => {
        if (loading || !showRedirectMsg || !user) return;

        const t = setTimeout(() => {
            if (user.role === "vendor") {
                router.replace("/vendor/dashboard");
            } else {
                router.replace("/");
            }
        }, 3000);

        return () => clearTimeout(t);
    }, [loading, showRedirectMsg, user]);

    const submit = async () => {
        if (loading) return;        // UX safety: block double submit
        try {
            await login(email, password);
            setShowRedirectMsg(true);
        } catch (error) {
            // error already stored in context
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3}>
            <Typography variant="h5" gutterBottom textAlign="center">
                Vendor Login
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {showRedirectMsg && user && (
                <Alert severity="success">
                    You are a {user.role}, redirecting…
                </Alert>
            )}

            <TextField
                label="Email"
                margin="normal"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                margin="normal"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />


            <Typography
                component={Link}
                href="/forgot-password"
                variant="body2"
                color="primary"
                sx={{
                    display: "block",
                    textAlign: "right",
                    mt: 1,
                    textDecoration: "none", "&:hover": {
                        textDecoration: "underline"
                    },
                }}
            >
                Forgot password?
            </Typography>

            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={submit}
                disabled={loading}>
                {loading ? "Logging In..." : "Login"}
            </Button>
            <Typography
                variant="body2"
                textAlign="center"
                sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Typography component={Link}
                    href="/signup"
                    color="primary"
                    sx={{
                        textDecoration: "none", "&:hover": { textDecoration: "underline" },
                    }}
                >
                    Signup
                </Typography>
            </Typography>

        </Box>
    );
} 