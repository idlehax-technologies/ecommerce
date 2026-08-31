"use client";

import { useEffect, useState } from "react";

import {
    Stack,
    Select,
    MenuItem,
    Button,
    Typography,
} from "@mui/material";

import { requestMembership } from "@/lib/api/memberships";
import { fetchActiveTenants } from "@/lib/api/tenants";

import { useSnackbar } from "@/contexts/SnackbarContext";

import type { PublicTenant } from "@/types/tenant";

export default function MembershipRequestForm({
    onRequested,
}: {
    onRequested: () => Promise<void>;
}) {
    const [tenantId, setTenantId] = useState("");
    const [loading, setLoading] = useState(false);
    const [tenants, setTenants] = useState<PublicTenant[]>([]);

    const { show } = useSnackbar();

    async function load() {
        try {
            const res = await fetchActiveTenants();
            setTenants(res.tenants);

        } catch (err: unknown) {
            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Failed to load tenants", "error");
            }
        }
    }

    async function submit() {
        try {
            setLoading(true);
            await requestMembership(tenantId);
            await onRequested();
            setTenantId("");
            show("Request submitted");

        } catch (err: unknown) {
            if (err instanceof Error) {
                show(err.message, "error");
            } else {
                show("Request failed", "error");
            }

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
                Request Access
            </Typography>

            <Select
                value={tenantId}
                onChange={(e) =>
                    setTenantId(e.target.value)
                }
                displayEmpty
            >
                <MenuItem value="">
                    Select Tenant
                </MenuItem>
                {tenants.map((tenant) => (
                    <MenuItem
                        key={tenant.tenantId}
                        value={tenant.tenantId}
                    >
                        {tenant.name}
                    </MenuItem>
                ))}
            </Select>

            <Button
                variant="contained"
                disabled={!tenantId || loading}
                onClick={submit}
            >
                {loading
                    ? "Requesting..."
                    : "Request"}
            </Button>
        </Stack>
    );
}