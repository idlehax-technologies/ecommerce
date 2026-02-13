"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container } from "@mui/material";
import MembershipReviewCard from "@/components/memberships/MembershipReviewCard";
import { getMembership } from "@/lib/api/memberships";

export default function Page() {
    const { membershipId } = useParams();
    const [membership, setMembership] = useState<any | null>(null);

    useEffect(() => {
        getMembership(membershipId as string).then(setMembership);
    }, [membershipId]);

    if (!membership) return null;

    return (
        <Container maxWidth="sm">
            <MembershipReviewCard m={membership} />
        </Container>
    );
}
