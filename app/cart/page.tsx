"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";

export default function CartPage() {
  return (
    // OUTER PAGE (grey like Amazon)
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor:"grey.200",
        py: 4,
      }}
    >
      {/* INNER CONTENT (white box) */}
      <Box
        p={3}
        maxWidth="800px"
        mx="auto"
        bgcolor="background.paper"
        borderRadius={2}
      >
        <Typography variant="h4" gutterBottom>
          My Cart
        </Typography>

        <Box display="flex" justifyContent="flex-end">
          <Typography variant="subtitle2" sx={{ mr: 2 }}>
            Price
          </Typography>
        </Box>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">
                Product Name
              </Typography>

              <Typography variant="h6">
                ₹999
              </Typography>
            </Box>

            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 1, borderRadius: 2 }}
            >
              🗑️ Remove
            </Button>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h6">
                Subtotal: ₹999
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Checkout
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
