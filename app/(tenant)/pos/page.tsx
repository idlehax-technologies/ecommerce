"use client";

import {
    Box,
    Stack,
    Typography,
    Paper,
    Divider,
} from "@mui/material";

import POSClient from "@/components/pos/POSClient";

export default function POSPage() {

    return (
        <Stack spacing={3} sx={{ p: 4 }}>
            <Box>
                <Typography variant="h5" fontWeight={600}>
                    Point of Sale
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Create and manage in-store orders
                </Typography>
            </Box>

            <Divider />

            <Paper elevation={2} sx={{ p: 2 }}>
                <POSClient />
            </Paper>
        </Stack>
    );
}