import { NextRequest, NextResponse } from "next/server";
import { createTenant, listTenants } from "@/lib/tenants/domain";
import { assertCreateTenantDTO } from "@/lib/tenants/validators";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET() {
    try {
        const user = await getUserFromRequest();
        requireRole(user, "superadmin");

        return NextResponse.json(listTenants());
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}

export async function POST(req: NextRequest) {
    try {
        const rawUser = await getUserFromRequest();
        requireRole(rawUser, "superadmin");

        const body: unknown = await req.json();

        assertCreateTenantDTO(body);

        const tenant = createTenant(body);

        return NextResponse.json(tenant);
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}