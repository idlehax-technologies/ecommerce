import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  findUserByEmail,
  verifyPassword,
} from "@/lib/db";

import { signToken } from "@/lib/jwt";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const ok = await verifyPassword(password, user.password);

    if (!ok) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId ?? undefined,
    });

    const res = NextResponse.json({
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId ?? undefined,
      },
    });

    res.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;

  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}
