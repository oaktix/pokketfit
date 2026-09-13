import { NextRequest, NextResponse } from 'next/server';
import { sendPushToUser } from '@/lib/notifications/push-server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, title, message, url, taskId, secret } = body;

    // Verify internal secret or admin authorization
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized push dispatch.' }, { status: 401 });
    }

    if (!userId || !title || !message) {
      return NextResponse.json({ error: 'Missing required parameters (userId, title, message).' }, { status: 400 });
    }

    const result = await sendPushToUser(userId, {
      title,
      body: message,
      url,
      taskId,
    });

    return NextResponse.json({
      success: true,
      deliveredDevices: result.successCount,
      failedDevices: result.failureCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server push dispatch failed.' }, { status: 500 });
  }
}
