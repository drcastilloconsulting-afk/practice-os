import { NextRequest, NextResponse } from 'next/server';
import { sendWeeklyDigest } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, subscriberName, reportHtml } = await req.json();

    if (!email || !subscriberName || !reportHtml) {
      return NextResponse.json(
        { error: 'email, subscriberName, and reportHtml are required' },
        { status: 400 }
      );
    }

    const result = await sendWeeklyDigest({
      to: email,
      subscriberName,
      reportHtml,
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in send-digest API route:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
