"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
} from "@mui/material";
import Link from "next/link";

export default function LoginPage() {
    const { login, user, loading, error } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (!user) return;
        if (user) router.replace("/");
    }, [user, router]);

    const submit = async () => {
        if (loading) return;
        await login(email, password);
    };

    return (
        <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3}>
            <Typography variant="h5" textAlign="center" gutterBottom>
                Login
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={submit} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </Button>

            <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                Don't have an account? <Link href="/signup">Signup</Link>
            </Typography>
        </Box>
    );
}
