"use client";

import { useCart } from "@/context/CartContext";
// import { useContext } from "react";
// import { CartProvider } from "@/context/CartContext";
import {
  Box,
  Typography,
  Container,
  Paper,
  Stack,
  Divider,
  Button,
} from "@mui/material";



export default function CheckoutPage() {
  const {items} = useCart();
  const total = items.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

// const cartContext = useContext(CartContext);
// const{cartItems,total} = cartContext;


// if(!cartContext){
//   return null;
// }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      {/* Page Title */}
      {/* <Typography variant="h4" gutterBottom>
        Checkout
      </Typography> */}

      {/* Order Summary Card */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>

        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Item
          </Typography>

          <Typography variant="subtitle2" color="text.secondary">
            Price
          </Typography>
        </Box>

        {/* <Divider sx={{ mb: 2 }} /> */}



        {/* Cart Items */}
        <Stack spacing={2}>
          {items.map((item)=>(
            <Box key={item.id} display="flex" justifyContent="space-between">
            <Typography>{item.name} (x{item.quantity})</Typography>
            <Typography>₹{item.price * item.quantity}</Typography>
          </Box>

          

          ))}
          
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Total Amount */}
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">₹{total}</Typography>
        </Box>

        {/* Place Order Button */}
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
          Place Order
        </Button>
      </Paper>
    </Container>
  );
}