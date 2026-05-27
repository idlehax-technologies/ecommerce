"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, CircularProgress, Typography } from "@mui/material";

import { getMembership } from "@/lib/api/memberships";
import type { MembershipView } from "@/types/membership";
import MembershipDetailCard from "@/components/memberships/MembershipDetailCard";

export default function Page() {
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
    }, [membershipId]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!membership) {
        return null;
    }

    return (
        <Container
            maxWidth="sm"
            sx={{ py: 4 }}
        >

            <Typography
                variant="h5"
                mb={3}
            >
                Membership Details
            </Typography>

            <MembershipDetailCard
                m={membership}
                reload={load}
            />

        </Container>
    );
}