"use client";

import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "@/context/CartContext";
import type { CartItemType } from "@/types/cart";

export default function CartItem({ item }: { item: CartItemType }) {
  const { increaseQuantity, decreaseQuantity, startPendingRemove } = useCart();

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography fontWeight={600}>{item.name}</Typography>

          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <IconButton
              size="small"
              onClick={() => decreaseQuantity(item.productId)}
            >
              <RemoveIcon />
            </IconButton>

            <Typography>{item.quantity}</Typography>

            <IconButton
              size="small"
              onClick={() => increaseQuantity(item.productId)}
            >
              <AddIcon />
            </IconButton>
          </Box>

          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => startPendingRemove(item.productId)}
            sx={{ mt: 1 }}
          >
            Remove
          </Button>
        </Box>

        <Typography>
          ₹{item.price} × {item.quantity}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
}
