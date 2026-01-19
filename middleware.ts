import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession = request.cookies.has("admin_session");

  const publicAdminRoutes = [
    "/admin/login",
    "/admin/signup",
  ];

  const publicAdminApiRoutes = [
    "/api/admin/login",
    "/api/admin/signup",
    "/api/admin/logout",
    "/api/admin/verify",
  ];

  // ✅ Allow public admin pages
  if (publicAdminRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Allow public admin APIs
  if (publicAdminApiRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 🔐 Protect admin pages
  if (pathname.startsWith("/admin") && !hasSession) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  // 🔐 Protect ONLY admin APIs
  if (pathname.startsWith("/api/admin") && !hasSession) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
