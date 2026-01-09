"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

import {
  Box,
  Typography,
  Container,
  Paper,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import { NextResponse } from "next/server";

export default function CheckoutPage() {
  const { items, placeOrder, failOrder, orderAttempted } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !orderAttempted) {
      router.replace("/cart");
    }
  }, [items, orderAttempted, router]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function handleCheckout() {
    setIsProcessing(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          total,
          currency: "INR",
        }),
      });

      const data = await res.json();

      if (data.success) {
        placeOrder();
        router.push("/success");
      } else {
        failOrder();
        router.push("/failure");
      }
    } catch (error) {
      failOrder();
      router.push("/failure");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>

      {/* Order Summary Card */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>

        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Item
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Price
          </Typography>
        </Box>

        {/* Cart Items */}
        <Stack spacing={2}>
          {items.map((item) => (
            <Box key={item.id} display="flex" justifyContent="space-between">
              <Typography>{item.name} (x{item.quantity})</Typography>
              <Typography>₹{item.price * item.quantity}</Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Total Amount */}
        <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">₹{total}</Typography>
        </Box>

        {/* Place Order Button */}
        <Button
          variant="contained"
          fullWidth
          disabled={isProcessing}
          onClick={handleCheckout}
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </Paper>
    </Container>

  );
}