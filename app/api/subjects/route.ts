import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('questions')
      .select('subject');

    if (error) {
      console.error(error);
      return NextResponse.json({ subjects: [] }, { status: 500 });
    }

    // ✅ normalize + deduplicate
    const subjects = Array.from(
      new Set(
        (data || [])
          .map(q => q.subject?.trim().toLowerCase())
          .filter(Boolean)
      )
    ).map(
      s => s.charAt(0).toUpperCase() + s.slice(1)
    );

    return NextResponse.json({ subjects });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ subjects: [] }, { status: 500 });
  }
}
