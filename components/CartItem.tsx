"use client";

import {
  Box,
  Typography,
  IconButton,
  Button,
  Collapse,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import {  useState } from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
  onRemove: (item: Props["item"]) => void;

};

export default function CartItem({ item, onRemove }: Props) {
//   const [visible, setVisible] = useState(true);
  const { increaseQuantity, decreaseQuantity } = useCart();
  

const handleRemove = () => {
//   setVisible(false);
  onRemove(item); // ONLY request removal
};



  return (
    // <Collapse in={visible} timeout={200}>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          {/* LEFT: Item info */}
          <Box>
            <Typography fontWeight={600}>{item.name}</Typography>

            {/* Quantity controls */}
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <IconButton
                size="small"
                onClick={() => decreaseQuantity(item.id)}
              >
                <RemoveIcon />
              </IconButton>

              <Typography>{item.quantity}</Typography>

              <IconButton
                size="small"
                onClick={() => increaseQuantity(item.id)}
              >
                <AddIcon />
              </IconButton>
            </Box>

            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleRemove}
              sx={{ mt: 1 }}
            >
              Remove
            </Button>
          </Box>

          {/* RIGHT: Price */}
          <Typography>
            ₹{item.price} × {item.quantity}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />
      </Box>
    // </Collapse>
  );
}
