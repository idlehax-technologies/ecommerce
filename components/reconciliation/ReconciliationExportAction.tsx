"use client";

import { useState } from "react";

import { Button } from "@mui/material";

import { exportCSV } from "@/lib/api/export";

import { useSnackbar } from "@/contexts/SnackbarContext";

import type { ExportType } from "@/types/export";

const type: ExportType = "RECONCILIATION";

export default function ReconciliationExportAction() {

    const { show } = useSnackbar();

    const [loading, setLoading] = useState(false);

    async function executeExport() {
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
        <Button
            variant="contained"
            disabled={loading}
            onClick={executeExport}
        >
            Export Reconciliation
        </Button>
    );
}