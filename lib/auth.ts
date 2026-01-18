import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_SESSION_COOKIE = "admin_session";
const JWT_SECRET = process.env.JWT_SECRET!;

type AdminTokenPayload = {
  adminId: string;
};

export function setAdminSession(adminId: string) {
  const token = jwt.sign(
    { adminId } as AdminTokenPayload,
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export function getAdminSession(): string | null {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    return decoded.adminId;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  cookies().set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // ✅ delete cookie
    path: "/",
  });
}

export function getAdminSessionFromRequest(
  request: NextRequest
): string | null {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    return decoded.adminId;
  } catch {
    return null;
  }
}
