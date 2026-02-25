// app/admin/tenants/new/page.tsx

import { redirect } from "next/navigation";
import { Container, Stack, TextField, Button, Typography, Card, CardContent } from "@mui/material";

import { createTenantUseCase } from "@/lib/tenants/service";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";

/**
 * Superadmin Tenant Creation Page (Server Action Driven)
 */

export default async function NewTenantPage() {

    const rawUser = await getUserFromRequest();
    requireRole(rawUser, "superadmin");

    async function create(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;

        await createTenantUseCase({ name });

        redirect("/platform/tenants");
    }

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Card>
                <CardContent>
                    <form action={create}>
                        <Stack spacing={3}>
                            <Typography variant="h5">Create Tenant</Typography>

                            <TextField label="School Name" name="name" required fullWidth />

                            <Stack direction="row" spacing={2}>
                                <Button type="submit" variant="contained">
                                    Create
                                </Button>

                                <Button href="/platform/tenants">Cancel</Button>
                            </Stack>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}