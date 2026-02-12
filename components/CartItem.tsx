"use client";

import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Box,
  Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import { useCart } from "@/contexts/CartContext";
import type { CartItemType } from "@/types/cart";

type Props = {
  item: CartItemType;
};

export default function CartItem({ item }: Props) {
  const {
    increaseQuantity,
    decreaseQuantity,
    startPendingRemove,
  } = useCart();

  const total = (item.price * item.quantity) / 100;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          {/* Product info */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {item.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              ₹ {(item.price / 100).toFixed(2)} each
            </Typography>
          </Box>

          {/* Quantity controls */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              onClick={() => decreaseQuantity(item.productId)}
              size="small"
            >
              <RemoveIcon />
            </IconButton>

            <Typography>{item.quantity}</Typography>

            <IconButton
              onClick={() => increaseQuantity(item.productId)}
              size="small"
            >
              <AddIcon />
            </IconButton>
          </Stack>

          {/* Total + remove */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography fontWeight={600}>
              ₹ {total.toFixed(2)}
            </Typography>

            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => startPendingRemove(item.productId)}
            >
              Remove
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
