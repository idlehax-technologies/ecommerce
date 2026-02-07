"use client";

import {
  Box,
  Typography,
  Button,
  Divider,
  Stack,
  Container,
  Snackbar,
  Paper,
  Collapse,
} from "@mui/material";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddIcon from "@mui/icons-material/Add";

export default function CartPage() {
  const { items, clearCart, pendingRemove, stopPendingRemove } = useCart();

  // paise → rupees
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const subtotalRupees = (subtotal / 100).toFixed(2);

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  // -----------------------------
  // Empty state
  // -----------------------------
  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 5, textAlign: "center" }}>
          <ShoppingCartOutlinedIcon
            sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
          />

          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add some products to continue shopping.
          </Typography>

          <Button variant="contained" component={Link} href="/">
            Browse Products
          </Button>
        </Paper>
      </Container>
    );
  }

  // -----------------------------
  // Main cart
  // -----------------------------
  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Typography variant="h4" fontWeight={600}>
          My Cart ({itemCount})
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Items */}
        <Stack spacing={2}>
          {items.map((item) => {
            const isBeingRemoved =
              pendingRemove?.productId === item.productId;

            return (
              <Collapse key={item.productId} in={!isBeingRemoved} timeout={200}>
                <CartItem item={item} />
              </Collapse>
            );
          })}
        </Stack>

        {/* Add more */}
        <Button
          startIcon={<AddIcon />}
          component={Link}
          href="/"
          variant="text"
          sx={{ mt: 1, textTransform: "none" }}
        >
          Add more products
        </Button>

        <Divider sx={{ my: 2 }} />

        {/* Subtotal */}
        <Box display="flex" justifyContent="flex-end">
          <Typography variant="h6" fontWeight={600}>
            Subtotal: ₹ {subtotalRupees}
          </Typography>
        </Box>

        {/* Actions */}
        <Button
          variant="outlined"
          color="error"
          fullWidth
          sx={{ mt: 2 }}
          onClick={clearCart}
        >
          Clear Cart
        </Button>

        <Button
          variant="contained"
          fullWidth
          component={Link}
          href="/checkout"
          sx={{ mt: 1 }}
        >
          Checkout
        </Button>

        {/* Undo snackbar */}
        <Snackbar
          open={!!pendingRemove}
          autoHideDuration={3000}
          message="Item removed from cart"
          onClose={stopPendingRemove}
          action={
            <Button size="small" onClick={stopPendingRemove}>
              UNDO
            </Button>
          }
        />
      </Paper>
    </Container>
  );
}
