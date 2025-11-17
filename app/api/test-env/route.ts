import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    service_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? "LOADED" : "MISSING",
  });
}
