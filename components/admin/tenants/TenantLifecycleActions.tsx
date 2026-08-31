"use client";

import { useState } from "react";

import {
    Stack,
    Button,
    CircularProgress
} from "@mui/material";

import {
    assumeTenantAdmin,
    assumeTenantStaff,
} from "@/lib/api/tenants";

import { getMembershipLandingPage }
    from "@/lib/navigation/defaultLandingPage";

import type { Tenant } from "@/types/tenant";

type Props = {
    tenant: Tenant;

    activate: () => Promise<void>;
    suspend: () => Promise<void>;
    archive: () => Promise<void>;
};

export default function TenantLifecycleActions({
    tenant,
    activate,
    suspend,
    archive,
}: Props) {

    const [loading, setLoading] = useState<
        "admin" | "staff" | null
    >(null);

    async function handleAssumeAdmin() {
        try {
            setLoading("admin");
            await assumeTenantAdmin(tenant.tenantId);
            window.location.href = getMembershipLandingPage("admin");
        } finally {
            setLoading(null);
        }
    }

    async function handleAssumeStaff() {
        try {
            setLoading("staff");
            await assumeTenantStaff(tenant.tenantId);
            window.location.href = getMembershipLandingPage("staff");
        } finally {
            setLoading(null);
        }
    }

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <Stack
                direction="row"
                spacing={2}
            >
                {(tenant.status === "PENDING" ||
                    tenant.status === "SUSPENDED") && (
                        <form action={activate}>
                            <Button
                                type="submit"
                                color="success"
                                variant="contained"
                            >
                                Activate
                            </Button>
                        </form>
                    )}

                {tenant.status === "ACTIVE" && (
                    <form action={suspend}>
                        <Button
                            type="submit"
                            color="warning"
                            variant="contained"
                        >
                            Suspend
                        </Button>
                    </form>
                )}

                {tenant.status !== "ARCHIVED" && (
                    <form action={archive}>
                        <Button
                            type="submit"
                            color="error"
                            variant="contained"
                        >
                            Archive
                        </Button>
                    </form>
                )}
            </Stack>

            <Stack
                direction="row"
                spacing={2}
            >
                <Button
                    variant="outlined"
                    onClick={handleAssumeAdmin}
                    disabled={loading !== null}
                >
                    {loading === "admin"
                        ? <CircularProgress size={20} />
                        : "Admin"
                    }
                </Button>

                <Button
                    variant="outlined"
                    onClick={handleAssumeStaff}
                    disabled={loading !== null}
                >
                    {loading === "staff"
                        ? <CircularProgress size={20} />
                        : "Staff"
                    }
                </Button>
            </Stack>
        </Stack>
    );
}