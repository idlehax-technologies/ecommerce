"use client";

import { Container, Typography, Stack } from "@mui/material";

import { useCart } from "@/contexts/CartContext";
import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import CheckoutButton from "@/components/checkout/CheckoutButton";

export default function CheckoutPage() {
  const { cart } = useCart();

  if (!cart) return null;

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Stack spacing={3}>
        <CartList
          cart={cart}
          removeItem={async () => { }}
          registerUndo={() => { }}
        />

        <CartSummary items={cart.items} />

        <CheckoutButton />
      </Stack>
    </Container>
  );
}