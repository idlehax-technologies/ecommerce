import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 *
 * Stateless JWT logout:
 * Just expire the cookie.
 */
export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.set("auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // expire immediately
  });

  return res;
}
