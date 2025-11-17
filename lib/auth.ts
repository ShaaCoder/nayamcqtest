import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const ADMIN_SESSION_COOKIE = 'admin_session';

export function setAdminSession(adminId: string) {
  cookies().set(ADMIN_SESSION_COOKIE, adminId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function getAdminSession(): string | undefined {
  return cookies().get(ADMIN_SESSION_COOKIE)?.value;
}

export function clearAdminSession() {
  cookies().delete(ADMIN_SESSION_COOKIE);
}

export function getAdminSessionFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
}
