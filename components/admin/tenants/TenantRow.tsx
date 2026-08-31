"use client";

import Link from "next/link";

import {
    Paper,
    Stack,
    Typography,
    Chip,
} from "@mui/material";

import TenantStatusBadge from "./TenantStatusBadge";
import type { Tenant } from "@/types/tenant";

export default function TenantRow({
    tenant,
}: {
    tenant: Tenant;
}) {
    return (
        <Paper
            elevation={2}
            component={Link}
            href={`/platform/tenants/${tenant.tenantId}`}
            sx={{
                p: 2,
                textDecoration: "none",
                display: "block",
            }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Stack spacing={0.25}>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <Typography fontWeight={600}>
                            {tenant.name}
                        </Typography>

                        <Chip
                            size="small"
                            color={
                                tenant.gstin
                                    ? "success"
                                    : "default"
                            }
                            label={
                                tenant.gstin
                                    ? "GST"
                                    : "Non-GST"
                            }
                        />
                    </Stack>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {tenant.state}
                    </Typography>
                </Stack>

                <TenantStatusBadge
                    status={tenant.status}
                />
            </Stack>
        </Paper>
    );
}