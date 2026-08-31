"use client";

import { useEffect, useState }
    from "react";

import {
    Box,
    Stack,
    Typography,
    CircularProgress,
    Divider,
    Paper,
} from "@mui/material";

import MembershipsDashboard
    from "@/components/memberships/MembershipsDashboard";

import { fetchMemberships }
    from "@/lib/api/memberships";

import type { MembershipView }
    from "@/types/membership";

export default function MembershipsPage() {

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
        <Stack spacing={3} sx={{ p: 4 }}>
            <Box>
                <Typography variant="h5" fontWeight={600}>
                    Memberships
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    View and manage memberships within your tenant
                </Typography>
            </Box>

            <Divider />

            <Paper elevation={2} sx={{ p: 2 }}>
                <MembershipsDashboard
                    memberships={memberships}
                />
            </Paper>
        </Stack>
    );
}