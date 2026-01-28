import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { hashPassword, createUser, findUserByEmail } from "@/lib/db";

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

    const { email, password, role } = body;

    if (!email || !password || !role)
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    if (role !== "customer" && role !== "vendor") {
      return NextResponse.json(
        { message: "Invalid role" },
        { status: 400 }
      );
    }

    const exists = await findUserByEmail(email);
    if (exists)
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });

    const hashed = await hashPassword(password);
    const user = await createUser({ email, password: hashed, role });

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

  } catch (e) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
