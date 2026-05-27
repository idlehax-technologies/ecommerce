"use client";

import {
    Container,
    Typography,
    Stack,
    CircularProgress,
} from "@mui/material";

import MembershipDashboard
    from "@/components/memberships/MembershipDashboard";

import { useEffect, useState }
    from "react";

import { useActiveMembership }
    from "@/hooks/useActiveMembership";

import { fetchMemberships }
    from "@/lib/api/memberships";

import type { MembershipView }
    from "@/types/membership";

export default function Page() {

    const { membership } = useActiveMembership();

    const [memberships, setMemberships] = useState<MembershipView[]>([]);

    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setLoading(true);
            const res = await fetchMemberships();
            setMemberships(res.memberships);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container sx={{ py: 4 }}>

            <Stack mb={3} spacing={0.5}>

                <Typography variant="h5">
                    Membership Operations
                </Typography>

                {membership && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Tenant: {membership.tenantId}
                    </Typography>
                )}

            </Stack>

            <MembershipDashboard
                memberships={memberships}
            />

        </Container>
    );
}