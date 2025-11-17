import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/auth';

export async function POST() {
  try {
    clearAdminSession();
    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
