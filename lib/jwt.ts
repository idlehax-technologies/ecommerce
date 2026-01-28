import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

type JwtPayload = {
  id: string;
  role: "customer" | "vendor";
};

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string) =>
  jwt.verify(token, SECRET) as JwtPayload;
