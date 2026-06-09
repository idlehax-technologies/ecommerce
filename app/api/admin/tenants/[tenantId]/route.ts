import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireSuperadmin } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { updateTenantUseCase } from "@/lib/tenants/service";
import { validateUpdateTenant } from "@/lib/tenants/validators";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });
        requireSuperadmin(user);

        const body: unknown = await req.json();
        validateUpdateTenant(body);

        const tenant = await updateTenantUseCase(tenantId, body);

        return NextResponse.json({ tenant });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}