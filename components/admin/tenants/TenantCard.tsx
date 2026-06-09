import Link from "next/link";

import {
    Card,
    CardContent,
    Stack,
    Typography,
    Button,
    Chip,
} from "@mui/material";

import type { Tenant } from "@/types/tenant";

import TenantStatusBadge from "./TenantStatusBadge";

export default function TenantCard({
    tenant,
}: {
    tenant: Tenant;
}) {
    return (
        <Card>
            <CardContent>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Stack spacing={1}>
                        <Typography variant="h6">
                            {tenant.name}
                        </Typography>

                        <TenantStatusBadge
                            status={tenant.status}
                        />

                        {tenant.gstin ? (
                            <Chip
                                size="small"
                                color="success"
                                label="GST"
                            />
                        ) : (
                            <Chip
                                size="small"
                                color="default"
                                label="Non-GST"
                            />
                        )}
                    </Stack>

                    <Link
                        href={`/platform/tenants/${tenant.tenantId}`}
                        style={{
                            textDecoration: "none",
                        }}
                    >
                        <Button variant="outlined">
                            Manage
                        </Button>
                    </Link>
                </Stack>
            </CardContent>
        </Card>
    );
}