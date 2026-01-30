import { NextResponse } from "next/server";

export async function POST(_req: Request) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("auth", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production"
  });
  return res;
}
