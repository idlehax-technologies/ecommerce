"use client";

import { useEffect, useState } from "react";

import {
  Container,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";

import { useActiveMembership } from "@/hooks/useActiveMembership";
import { useCart } from "@/contexts/CartContext";

import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import CheckoutButton from "@/components/checkout/CheckoutButton";

import { fetchTenant } from "@/lib/api/tenants";
import type { Tenant } from "@/types/tenant";

export default function CheckoutPage() {
  const { membership, loading: mLoading } = useActiveMembership();
  const { cart } = useCart();

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

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
    return null;
  }

  return (
    <Container sx={{ mt: 6 }}>

      <Typography
        variant="h4"
        gutterBottom
      >
        Checkout
      </Typography>

      <Stack spacing={3}>

        <CartList cart={cart} />

        <CartSummary
          items={cart.items}
          hasGst={!!tenant.gstin}
        />

        <CheckoutButton />

      </Stack>

    </Container>
  );
}