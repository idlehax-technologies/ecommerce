"use client";

import Link from "next/link";

import { Badge, IconButton, Tooltip } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useCart } from "@/contexts/CartContext";
import { useActiveMembership } from "@/hooks/useActiveMembership";

export default function CartWidget() {
    const { cart, loading: cartLoading, } = useCart();
    const { membership, loading: membershipLoading, } = useActiveMembership();

    if (
        membershipLoading ||
        cartLoading ||
        !cart ||
        membership?.role !== "customer"
    ) {
        return null;
    }

    const cartCount = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <Tooltip title="Cart">
            <IconButton
                component={Link}
                href="/cart"
                size="small"
                color="inherit"
            >
                <Badge
                    badgeContent={cartCount}
                    color="primary"
                >
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>
        </Tooltip>
    );
}