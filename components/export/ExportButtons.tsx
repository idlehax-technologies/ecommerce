"use client";

import { useState } from "react";

import { Button, Stack } from "@mui/material";

import { exportCSV } from "@/lib/api/export";

import { useSnackbar } from "@/contexts/SnackbarContext";

export default function ExportButtons() {
    const [loading, setLoading] = useState(false);

    const { show } = useSnackbar();

    async function handleExport(
        type: "ORDERS" | "RECONCILIATION"
    ) {
        try {
            setLoading(true);
            await exportCSV({ type });
            show("Export completed");

        } catch (err: unknown) {
            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Export failed", "error");
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <Stack
            direction="row"
            spacing={2}
        >

            <Button
                variant="contained"
                disabled={loading}
                onClick={() =>
                    handleExport("ORDERS")
                }
            >
                Export Orders
            </Button>

            <Button
                variant="outlined"
                disabled={loading}
                onClick={() =>
                    handleExport("RECONCILIATION")
                }
            >
                Export Reconciliation
            </Button>

        </Stack>
    );
}