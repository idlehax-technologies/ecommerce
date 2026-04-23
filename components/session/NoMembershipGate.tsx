"use client";

import { useActiveMembership } from "@/hooks/useActiveMembership";
import { useAuth } from "@/contexts/AuthContext";
import { CircularProgress, Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function NoMembershipGate({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const { membership, loading: mLoading } = useActiveMembership();

    if (loading || mLoading) return <CircularProgress />;

    if (user && !membership) {
        return (
            <Box textAlign="center" mt={10}>
                <Typography variant="h6">
                    Complete profile and request access
                </Typography>

                <Button component={Link} href="/profile" sx={{ mt: 2 }}>
                    Go to Profile
                </Button>
            </Box>
        );
    }

    return <>{children}</>;
}