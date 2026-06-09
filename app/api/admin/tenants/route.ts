import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireSuperadmin } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { createTenantUseCase } from "@/lib/tenants/service";
import { validateCreateTenant } from "@/lib/tenants/validators";

export async function POST(req: Request) {
    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });
        requireSuperadmin(user);

        const body: unknown = await req.json();
        validateCreateTenant(body);

        const tenant = await createTenantUseCase(body);

        return NextResponse.json({ tenant });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}