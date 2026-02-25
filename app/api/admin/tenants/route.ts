import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/http/handleRouteError";
import {
    listAllTenants,
    createTenantUseCase,
} from "@/lib/tenants/service";

export async function GET() {
    try {
        const tenants = await listAllTenants();
        return NextResponse.json(tenants);
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const tenant = await createTenantUseCase(body);
        return NextResponse.json(tenant);
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}