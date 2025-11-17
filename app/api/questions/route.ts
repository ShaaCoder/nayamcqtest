import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';  // <-- FIXED
import { getAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subject = searchParams.get('subject');

    let query = supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (subject) {
      query = query.eq('subject', subject);
    }

    const { data: questions, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Get questions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminId = await getAdminSession(); // <-- FIXED: async
    if (!adminId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { question_text, option_a, option_b, option_c, option_d, correct_index, subject } = body;

    if (
      !question_text ||
      !option_a ||
      !option_b ||
      !option_c ||
      !option_d ||
      correct_index === undefined ||
      !subject
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (correct_index < 0 || correct_index > 3) {
      return NextResponse.json(
        { error: 'Correct index must be between 0 and 3' },
        { status: 400 }
      );
    }

    const { data: question, error } = await supabaseAdmin
      .from('questions')
      .insert({
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_index,
        subject,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create question' },
        { status: 500 }
      );
    }

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
