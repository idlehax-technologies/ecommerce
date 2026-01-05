"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    // OUTER PAGE (grey like Amazon)
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.200",
        py: 4,
      }}
    >
      {/* INNER CONTENT (white box) */}
      <Box
        p={3}
        maxWidth="800px"
        mx="auto"
        bgcolor="background.paper"
        borderRadius={2}
      >
        <Typography variant="h4" gutterBottom>
          My Cart
        </Typography>

        {items.length === 0 && (
          <Typography sx={{ mt: 4 }} color="text.secondary">
            Your cart is empty.
          </Typography>
        )}

        <Box display="flex" justifyContent="flex-end">
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Price
          </Typography>
        </Box>

        {items.map((item) => (
          <Card sx={{ mb: 2 }} key={item.id}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {item.name}
                </Typography>

                <Typography variant="body1">
                  ₹{item.price} × {item.quantity}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 1, borderRadius: 2 }}
                onClick={() => removeFromCart(item.id)}
              >
                🗑️ Remove
              </Button>
            </CardContent>
          </Card>
        ))}

        <Divider sx={{ my: 2 }} />

        {items.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="h6">
                  Subtotal: ₹{subtotal}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {items.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            fullWidth
            sx={{ mb: 2 }}
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        )}


        <Button
          variant="contained"
          fullWidth
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
}
