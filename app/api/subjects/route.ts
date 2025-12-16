import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic'; // 🔴 VERY IMPORTANT
export const revalidate = 0;             // 🔴 NO CACHE

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('questions')
    .select('subject');

  if (error) {
    return NextResponse.json({ subjects: [] });
  }

  const subjects = Array.from(
    new Set(
      data
        .map(q => q.subject?.trim())
        .filter(Boolean)
    )
  );

  return NextResponse.json({ subjects });
}
