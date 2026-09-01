"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
    Container,
    Box,
    Stack,
    Typography,
    Divider,
    Paper,
    CircularProgress,
} from "@mui/material";

import MembershipDetail from "@/components/memberships/MembershipDetail";
import { getMembership } from "@/lib/api/memberships";
import { formatDateTime } from "@/lib/format/datetime";
import type { MembershipView } from "@/types/membership";

export default function MembershipDetailPage() {
    const { membershipId } = useParams<{ membershipId: string }>();

    const [membership, setMembership] = useState<MembershipView | null>(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setLoading(true);
            const res = await getMembership(membershipId);
            setMembership(res.membership);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [membershipId]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return <CircularProgress />;
    }

    if (!membership) {
        return null;
    }

    return (
        <Container maxWidth="md">
            <Stack spacing={3} sx={{ p: 6 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Membership Details
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Created: {formatDateTime(membership.createdAt)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Updated: {formatDateTime(membership.updatedAt)}
                    </Typography>
                </Box>

                <Divider />

                <Paper elevation={2} sx={{ p: 2 }}>
                    <MembershipDetail
                        membership={membership}
                        reload={load}
                    />
                </Paper>
            </Stack>
        </Container>
    );
}