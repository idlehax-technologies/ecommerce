"use client";

import { useState } from "react";

import {
    Button,
    CircularProgress,
} from "@mui/material";

type Props = {
    disabled: boolean;
    onSubmit: () => Promise<void>;
};

export default function POSCheckoutAction({
    disabled,
    onSubmit,
}: Props) {

    const [loading, setLoading] = useState(false);

    async function executeCheckout() {
        if (loading || disabled) {
            return;
        }

        try {
            setLoading(true);
            await onSubmit();
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="contained"
            disabled={loading || disabled}
            onClick={executeCheckout}
        >
            {loading
                ? <CircularProgress size={22} />
                : "Create Order"}
        </Button>
    );
}