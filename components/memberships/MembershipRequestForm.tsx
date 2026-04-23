"use client";

import { useState } from "react";
import {
    Stack,
    Select,
    MenuItem,
    Button,
    Typography,
} from "@mui/material";

import { requestMembership } from "@/lib/api/memberships";
import { useSnackbar } from "@/components/common/AppSnackbar";

export default function MembershipRequestForm() {
    const [tenantId, setTenantId] = useState("");
    const [loading, setLoading] = useState(false);
    const { show } = useSnackbar();

    async function submit() {
        try {
            setLoading(true);
            await requestMembership(tenantId);
            show("Request submitted");
        } catch {
            show("Request failed", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h6">Request Access</Typography>

            <Select
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                displayEmpty
            >
                <MenuItem value="">Select Tenant</MenuItem>
                <MenuItem value="tenant_alpha">tenant_alpha</MenuItem>
                <MenuItem value="tenant_mnsnhs">tenant_mnsnhs</MenuItem>
            </Select>

            <Button
                variant="contained"
                disabled={!tenantId || loading}
                onClick={submit}
            >
                {loading ? "Requesting..." : "Request"}
            </Button>
        </Stack>
    );
}