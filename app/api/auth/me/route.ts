import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(_req: Request) {
  const user = await getUserFromRequest();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json({ user });
}
