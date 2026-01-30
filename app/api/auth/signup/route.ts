import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { hashPassword, createUser, findUserByEmail } from "@/lib/db";
import { getVendorIdForUser } from "@/lib/vendors";

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


    let vendorId: string | undefined;

    if (user.role === "vendor") {
      const resolvedVendorId = await getVendorIdForUser(user.id);
      if (!resolvedVendorId) {
        return NextResponse.json(
          { message: "Vendor account not configured" },
          { status: 500 }
        );
      }
      vendorId = resolvedVendorId;
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      vendorId,
    });

    const res = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        vendorId: user.role === "vendor" ? vendorId : undefined
      }
    });

    res.cookies.set("auth", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return res;

  } catch (e) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
