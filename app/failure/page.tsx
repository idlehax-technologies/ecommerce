"use client";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import Link from "next/link";

export default function SuccessPage() {
  return (
    <Box
      minHeight="100vh"
      bgcolor="grey.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          textAlign: "center",
          borderRadius: 3,
          boxShadow: 10,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <CancelRoundedIcon 
            color="error"
            sx={{ fontSize: 50, mb: 2 }}
          />

          <Typography variant="h5" gutterBottom>
            Order  cannot be placed
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Something is wrong please try again.
          </Typography>

          <Button
            variant="contained"
            component={Link}
            href="/"
            size="large"
            sx={{ borderRadius: '8px' }}
          >
            Go back to Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
