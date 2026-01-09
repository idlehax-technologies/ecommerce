"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function SuccessPage() {
  const { orderAttempted, orderPlaced, resetOrderState } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!orderAttempted || !orderPlaced) {
      router.replace("/");
    }
  }, [orderAttempted, orderPlaced, router]);

  return (
    <Box
      minHeight="100vh"
      bgcolor="grey.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          textAlign: "center",
          borderRadius: 3,
          boxShadow: 10,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <CheckCircleIcon
            color="success"
            sx={{ fontSize: 50, mb: 2 }}
          />

          <Typography variant="h5" gutterBottom>
            Order Successful
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Thank you for your purchase!
            Your order has been placed and will be processed shortly.
          </Typography>

          <Button
            variant="contained"
            size="large"
            sx={{ borderRadius: '8px' }}
            onClick={() => {
              resetOrderState();
              router.push("/");
            }}
          >
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
