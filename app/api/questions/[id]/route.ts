import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAdminSession } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = getAdminSession();
    if (!adminId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { question_text, option_a, option_b, option_c, option_d, correct_index, subject } = body;

    if (!question_text || !option_a || !option_b || !option_c || !option_d ||
        correct_index === undefined || !subject) {
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
      .update({
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_index,
        subject,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update question' },
        { status: 500 }
      );
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Update question error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = getAdminSession();
    if (!adminId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { error } = await supabaseAdmin
      .from('questions')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete question' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
