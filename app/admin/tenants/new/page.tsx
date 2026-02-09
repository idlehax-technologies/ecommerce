"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Container,
    Stack,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
} from "@mui/material";

import { tenantAdminApi } from "@/lib/api/tenantManagement";
import RoleGuard from "@/components/RoleGuard";

export default function NewTenantPage() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const submit = async () => {
        if (!name.trim()) return;

        setLoading(true);
        await tenantAdminApi.create({ name });
        router.push("/admin/tenants");
    };

    return (
        <RoleGuard allow={["superadmin"]}>
            <Container maxWidth="sm" sx={{ py: 6 }}>
                <Card>
                    <CardContent>
                        <Stack spacing={3}>
                            <Typography variant="h5">Create Tenant</Typography>

                            <TextField
                                label="School Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                            />

                            <Stack direction="row" spacing={2}>
                                <Button variant="contained" onClick={submit} disabled={loading}>
                                    Create
                                </Button>

                                <Button onClick={() => router.push("/admin/tenants")}>
                                    Cancel
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </RoleGuard>
    );
}
