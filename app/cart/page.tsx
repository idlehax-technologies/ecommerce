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
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import CartItem from "@/components/CartItem";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddIcon from "@mui/icons-material/Add";

export default function CartPage() {
  const { items, clearCart, pendingRemove, stopPendingRemove } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <ShoppingCartOutlinedIcon
            sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Looks like you haven't added anything yet.
          </Typography>

          <Button variant="contained" size="large" component={Link} href="/">
            Browse Products
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4">
          My Cart
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Item
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Price
          </Typography>
        </Box>

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

        <Button
          startIcon={<AddIcon />}
          component={Link}
          href="/"
          variant="text"
          color="primary"
          sx={{ textTransform: "none", fontSize: 14 }}
        >
          Add more products
        </Button>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="flex-end">
          <Typography variant="h6">Subtotal: ₹{subtotal}</Typography>
        </Box>

        <Button
          variant="outlined"
          color="error"
          fullWidth
          sx={{ my: 2 }}
          onClick={clearCart}
        >
          Clear Cart
        </Button>

        <Button variant="contained" fullWidth component={Link} href="/checkout">
          Checkout
        </Button>

        <Snackbar
          open={!!pendingRemove} // pendingRemove (null -> falsy) => !pendingRemove (true) => !!pendingRemove (false)
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
