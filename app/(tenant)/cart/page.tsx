"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Typography,
  Button,
  Divider,
  Container,
  Snackbar,
  Paper,
  CircularProgress,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { useActiveMembership } from "@/hooks/useActiveMembership";
import { useCart } from "@/contexts/CartContext";

import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";

import { fetchTenant } from "@/lib/api/tenants";
import type { Tenant } from "@/types/tenant";

export default function CartPage() {
  const { membership, loading: mLoading } = useActiveMembership();
  const { cart, remove, clear } = useCart();

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [undoAction, setUndoAction] = useState<(() => void) | null>(null);
  const [open, setOpen] = useState(false);

  async function load() {
    if (!membership) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetchTenant(membership.tenantId);
      setTenant(res.tenant);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [membership]);

  if (mLoading || loading) {
    return <CircularProgress />;
  }

  if (
    !membership ||
    !tenant
  ) {
    return null;
  }

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

        <CartSummary
          items={cart.items}
          hasGst={!!tenant.gstin}
        />

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
