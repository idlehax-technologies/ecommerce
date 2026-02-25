"use client";

import {
  Typography,
  Button,
  Divider,
  Container,
  Snackbar,
  Paper,
} from "@mui/material";

import Link from "next/link";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { useCart } from "@/contexts/CartContext";
import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import { useState } from "react";

export default function CartPage() {
  const { cart, remove, clear } = useCart();

  const [undoAction, setUndoAction] = useState<(() => void) | null>(null);
  const [open, setOpen] = useState(false);

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 5, textAlign: "center" }}>
          <ShoppingCartOutlinedIcon
            sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
          />
          <Typography variant="h5">Your cart is empty</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add some products to continue shopping.
          </Typography>
          <Button variant="contained" component={Link} href="/products">
            Browse Products
          </Button>
        </Paper>
      </Container>
    );
  }

  function registerUndo(undo: () => void) {
    setUndoAction(() => undo);
    setOpen(true);
  }

  function handleUndo() {
    undoAction?.();
    setOpen(false);
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          My Cart ({cart.items.length})
        </Typography>

        <Divider sx={{ my: 2 }} />

        <CartList cart={cart} removeItem={remove} registerUndo={registerUndo} />

        <Divider sx={{ my: 2 }} />

        <CartSummary items={cart.items} />

        <Button
          variant="outlined"
          color="error"
          fullWidth
          sx={{ mt: 2 }}
          onClick={clear}
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

        <Snackbar
          open={open}
          autoHideDuration={3000}
          message="Item removed from cart"
          onClose={() => setOpen(false)}
          action={
            <Button size="small" onClick={handleUndo}>
              UNDO
            </Button>
          }
        />
      </Paper>
    </Container>
  );
}
