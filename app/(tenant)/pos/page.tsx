"use client";

import { Container, Typography, Box } from "@mui/material";

import POSClient from "@/components/pos/POSClient";

export default function POSPage() {
    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Staff POS
            </Typography>

            <Box mt={3}>
                <POSClient />
            </Box>
        </Container>
    );
}