import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { findUserById } from "@/lib/db";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/auth=([^;]+)/);
  if (!match) return NextResponse.json({}, { status: 401 });

  try {
    const payload = verifyToken(match[1]);
    const user = await findUserById(payload.id);
    if (!user) throw new Error();

    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role
    });
  } catch {
    return NextResponse.json({}, { status: 401 });
  }
}
