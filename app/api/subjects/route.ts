import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('subject');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch subjects' },
        { status: 500 }
      );
    }

    const subjects = Array.from(new Set(questions?.map(q => q.subject) || []));

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error('Get subjects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
