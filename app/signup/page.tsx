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


export default function CustomerSignupPage() {
  const { user, signup, loading, error } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [showRedirectMsg, setShowRedirectMsg] = useState(false);


  // useEffect(() => {
  //   if (loading) return;
  //   if (showRedirectMsg) return;
  //   if (user) {
  //     router.replace(user.role === "customer" ? "/" : "/vendor/dashboard");
  //   }
  // }, [loading, showRedirectMsg, user]);


  useEffect(() => {
    if (loading || !showRedirectMsg || !user) return;

    const t = setTimeout(() => {
      if (user.role === "customer") {
        router.replace("/");
      } else {
        router.replace("/vendor/dashboard");
      }
    }, 3000);

    return () => clearTimeout(t);
  }, [loading, showRedirectMsg, user]);


  const onPasswordChange = (value: string) => {
    setPassword(value);

    if (value !== confirmPassword) {
      setFormError("Passwords do not match");
    } else {
      setFormError(null);
    }
  };


  const onConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);

    if (password !== value) {
      setFormError("Passwords do not match");
    } else {
      setFormError(null);
    }
  };

  const submit = async () => {
    if (loading || formError) return;
    try {
      await signup(email, password, "customer");
      setShowRedirectMsg(true);
    } catch (error) {

    }
  }

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Customer Signup
      </Typography>
      {formError && <Alert severity="error">{formError}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      {showRedirectMsg && user && (
        <Alert severity="success">
          You are a {user.role}, redirecting…
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />


      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        margin="normal"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
      />

      <TextField
        fullWidth
        label="Role"
        value="Customer"
        margin="normal"
        disabled
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Creating account..." : "Sign Up"}
      </Button>


      <Typography
        variant="body2"
        textAlign="center"
        sx={{ mt: 2 }}
      >
        Already have an account?{" "}
        <Typography
          component={Link}
          href="/login"
          color="primary"
          sx={{
            textDecoration: "none", "&:hover": {
              textDecoration: "underline",
            }
          }}
        >
          Login
        </Typography>
      </Typography>
    </Box>
  );
}
