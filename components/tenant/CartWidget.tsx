"use client";

import Link from "next/link";

import { Badge, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Tenant Runtime Widget
 * Requires CartProvider → must NEVER render outside (tenant).
 */
export default function CartWidget() {
    const { user, loading } = useAuth();
    const role = user?.role;
    const isCustomer = role === "customer";

    const { cart } = useCart();
    const cartCount =
        cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    if (loading || !isCustomer) return null;

    return (
        <Button component={Link} href="/cart" color="inherit">
            <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon />
            </Badge>
        </Button>
    );
}