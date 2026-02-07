import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

/**
 * GET /api/auth/me
 *
 * Restore session from JWT cookie.
 * No DB hit needed.
 * Token already contains user payload.
 */
export async function GET() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}
