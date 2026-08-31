"use client";

import { useEffect, useState } from "react";

import {
  Container,
  Box,
  Paper,
  Stack,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";

import { useCart } from "@/contexts/CartContext";

import CartEmptyState from "@/components/cart/CartEmptyState";
import CartDetail from "@/components/cart/CartDetail";

import { getTenantProductView } from "@/lib/api/tenantInventory";
import { getTenant } from "@/lib/api/tenants";

import type {
  TenantProductRow,
} from "@/lib/mappers/tenantProductView";
import type { Tenant } from "@/types/tenant";

export default function CartPage() {
  const { cart, loading: cartLoading } = useCart();

  const [rows, setRows] = useState<TenantProductRow[]>([]);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);

      const [productRes, tenantRes] = await Promise.all([
        getTenantProductView(),
        getTenant(),
      ]);

      setRows(productRes.rows);
      setTenant(tenantRes.tenant);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (
    loading ||
    cartLoading
  ) {
    return <CircularProgress />;
  }

  if (!tenant) {
    return null;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <CartEmptyState
        title="Your cart is empty"
        description="Browse products to add items to your cart"
      />
    );
  }

  const cartCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <Container maxWidth="md">
      <Stack
        spacing={2}
        sx={{ p: { xs: 0, sm: 6 } }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            My Cart ({cartCount})
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Review the items before placing your order
          </Typography>
        </Box>

        <Divider />

        <Paper elevation={2} sx={{ p: 2 }}>
          <CartDetail
            cart={cart}
            rows={rows}
            hasGst={!!tenant.gstin}
          />
        </Paper>
      </Stack>
    </Container>
  );
}