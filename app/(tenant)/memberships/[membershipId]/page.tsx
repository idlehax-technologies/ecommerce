"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, CircularProgress } from "@mui/material";

import { getMembership } from "@/lib/api/memberships";
import type { MembershipView } from "@/types/membership";
import MembershipDetailCard from "@/components/memberships/MembershipDetailCard";

export default function Page() {
    const { membershipId } = useParams();
    const [m, setM] = useState<MembershipView | null>(null);

    async function load() {
        const data = await getMembership(membershipId as string);
        setM(data);
    }

    useEffect(() => {
        load();
    }, [membershipId]);

    if (!m) return <CircularProgress />;

    return (
        <Container maxWidth="sm">
            <MembershipDetailCard m={m} reload={load} />
        </Container>
    );
}