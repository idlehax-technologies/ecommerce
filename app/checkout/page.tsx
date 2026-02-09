"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { checkout } from "@/lib/api/checkout";

import type { CheckoutRequest, CheckoutResponse } from "@/types/checkout";

import {
  Box,
  Typography,
  Container,
  Paper,
  Stack,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";

export default function CheckoutPage() {
  const { items, placeOrder, failOrder, orderAttempted } = useCart();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);

  // redirect if cart empty and not coming from order attempt
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
    if (isProcessing) return;

    setIsProcessing(true);

    const payload: CheckoutRequest = {
      items: items
        .filter((i) => i.quantity > 0)
        .map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
    };

    try {
      const data = await checkout(payload);

      if (data.success) {
        placeOrder();
        router.push("/success");
      } else {
        failOrder();
        router.push("/failure");
      }
    } catch {
      failOrder();
      router.push("/failure");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2}>
          {items.map((item) => (
            <Box
              key={item.productId}
              display="flex"
              justifyContent="space-between"
            >
              <Typography>
                {item.name} (x{item.quantity})
              </Typography>

              <Typography>
                ₹ {(item.price * item.quantity / 100).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">
            ₹ {(total / 100).toFixed(2)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={isProcessing}
          onClick={handleCheckout}
        >
          {isProcessing ? (
            <CircularProgress size={22} />
          ) : (
            "Place Order"
          )}
        </Button>
      </Paper>
    </Container>
  );
}
