"use client";

import { useRef, useState, useEffect } from "react";
import {
    Box,
    Typography,
    IconButton,
    Paper,
    Collapse,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import type { CartItem } from "@/types/cart";

type Props = {
    item: CartItem;
    removeItem: (productId: string) => Promise<void>;
    registerUndo: (undo: () => void) => void;
};

export default function CartRow({ item, removeItem, registerUndo }: Props) {
    const [visible, setVisible] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    function startRemove() {
        setVisible(false);

        timerRef.current = setTimeout(() => {
            removeItem(item.productId);
        }, 3000);

        registerUndo(undo);
    }

    function undo() {
        if (timerRef.current) clearTimeout(timerRef.current);
        setVisible(true);
    }

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <Collapse in={visible} timeout={200}>
            <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <Typography fontWeight={500}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity}
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <Typography>₹{item.price}</Typography>
                    <IconButton onClick={startRemove}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Collapse>
    );
}
