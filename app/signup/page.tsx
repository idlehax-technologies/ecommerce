"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import Link from "next/link";

export default function SignupPage() {
  const { user, signup, loading, error } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    router.replace("/");
  }, [user, router]);

  const submit = async () => {
    if (loading) return;

    setFormError(null);

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    await signup(email, password);
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Sign Up
      </Typography>

      {formError && <Alert severity="error">{formError}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
      <TextField fullWidth label="Confirm Password" type="password" margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={submit} disabled={loading}>
        {loading ? "Creating..." : "Sign Up"}
      </Button>

      <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link href="/login">Login</Link>
      </Typography>
    </Box>
  );
}
