"use client";

import Link from "next/link";
import { Badge, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveMembership } from "@/hooks/useActiveMembership";

export default function CartWidget() {
    const { user, loading } = useAuth();
    const { cart } = useCart();
    const { membership, loading: mLoading } = useActiveMembership();

    const cartCount =
        cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    if (
        loading ||
        mLoading ||
        !user?.activeMembershipId ||
        membership?.role !== "customer"
    ) {
        return null;
    }

    return (
        <Button component={Link} href="/cart" color="inherit">
            <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon />
            </Badge>
        </Button>
    );
}