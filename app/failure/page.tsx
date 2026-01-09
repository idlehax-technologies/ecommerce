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
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

export default function FailurePage() {
  const { orderAttempted, orderPlaced, resetOrderState } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!orderAttempted || orderPlaced) {
      router.replace("/cart");
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
          <CancelRoundedIcon
            color="error"
            sx={{ fontSize: 50, mb: 2 }}
          />

          <Typography variant="h5" gutterBottom>
            Transaction Failed
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Something is wrong please try again.
          </Typography>

          <Button
            variant="contained"
            size="large"
            sx={{ borderRadius: '8px' }}
            onClick={() => {
              resetOrderState();
              router.push("/cart");
            }}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
