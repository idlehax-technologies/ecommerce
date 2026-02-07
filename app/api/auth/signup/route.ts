import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  findUserByEmail,
  createUser,
  hashPassword,
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

    const existing = await findUserByEmail(email);

    if (existing) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);

    const user = await createUser({
      email,
      password: hashed,
    });

    const token = signToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
      tenantId: undefined,
    });

    const res = NextResponse.json({
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
        tenantId: undefined,
      },
    });

    res.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;

  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { message: "Signup failed" },
      { status: 500 }
    );
  }
}
