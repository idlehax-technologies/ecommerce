"use client";

import { useState } from "react";
import {
    Box,
    Button,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import { requestMembership } from "@/lib/api/memberships";

type Tenant = {
    tenantId: string;
    name: string;
};

export default function MembershipRequestSection({
    tenants,
    disabled,
}: {
    tenants: Tenant[];
    disabled: boolean;
}) {
    const [tenantId, setTenantId] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!tenantId) return;
        setLoading(true);
        await requestMembership(tenantId);
        setLoading(false);
    };

    return (
        <Box mt={4}>
            <Typography variant="h6">Request Access</Typography>

            <Stack spacing={2} mt={2}>
                <Select
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    disabled={disabled}
                >
                    {tenants.map((t) => (
                        <MenuItem key={t.tenantId} value={t.tenantId}>
                            {t.name}
                        </MenuItem>
                    ))}
                </Select>

                <Button
                    variant="contained"
                    disabled={!tenantId || disabled || loading}
                    onClick={submit}
                >
                    Request Membership
                </Button>
            </Stack>
        </Box>
    );
}
