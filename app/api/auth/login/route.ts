import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { findUserByEmail, verifyPassword } from "@/lib/db";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email, password } = body;


    if (!email || !password)
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const user = await findUserByEmail(email);
    if (!user)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const ok = await verifyPassword(password, user.password);
    if (!ok)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const token = signToken({ id: user.id, role: user.role });

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, role: user.role }
    });

    res.cookies.set("auth", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax"
    });

    return res;

  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
