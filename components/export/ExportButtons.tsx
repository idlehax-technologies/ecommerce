"use client";

import { Button, Stack } from "@mui/material";
import { exportCSV } from "@/lib/api/export";

export default function ExportButtons() {
    return (
        <Stack direction="row" spacing={2}>
            <Button
                variant="contained"
                onClick={() => exportCSV({ type: "ORDERS" })}
            >
                Export Orders
            </Button>

            <Button
                variant="outlined"
                onClick={() => exportCSV({ type: "RECONCILIATION" })}
            >
                Export Reconciliation
            </Button>
        </Stack>
    );
}