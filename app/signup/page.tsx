"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import Link from "next/link";

export default function VendorSignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    setError("");

    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setError("Mock vendor signup only. No backend connected.");
      setLoading(false);
    }, 1000);
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Customer Signup
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        fullWidth
        label="Name"
        margin="normal"
      />

      <TextField
        fullWidth
        label="Email"
        margin="normal"
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      
     


    


      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSignup}
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
          sx={{ textDecoration: "none","&:hover":{
            textDecoration:"underline",
          } }}
        >
          Login
        </Typography>
      </Typography>
    </Box>
  );
}
