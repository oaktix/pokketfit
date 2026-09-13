import webPush from 'web-push';
import { createAdminClient } from '@/lib/supabase/admin';

// Configure Web Push VAPID credentials safely
function ensureVapidConfigured() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (
    publicKey &&
    privateKey &&
    !publicKey.includes('your-vapid') &&
    !privateKey.includes('your-vapid')
  ) {
    try {
      webPush.setVapidDetails(
        process.env.VAPID_SUBJECT || 'mailto:coach@pokketfit.app',
        publicKey,
        privateKey
      );
      return true;
    } catch (e) {
      console.warn('VAPID initialization note:', e);
      return false;
    }
  }
  return false;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  taskId?: string;
}

/**
 * Sends a web push notification to all active devices of a user.
 * Automatically prunes expired (410 Gone / 404 Not Found) subscriptions from Supabase.
 */
export async function sendPushToUser(
  userId: string,
  payload: PushNotificationPayload
): Promise<{ successCount: number; failureCount: number }> {
  const isVapidReady = ensureVapidConfigured();
  if (!isVapidReady) {
    return { successCount: 0, failureCount: 0 };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return { successCount: 0, failureCount: 0 };
  }

  // Fetch user's registered push subscriptions
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId);

  if (error || !subscriptions || subscriptions.length === 0) {
    return { successCount: 0, failureCount: 0 };
  }

  let successCount = 0;
  let failureCount = 0;

  const pushString = JSON.stringify(payload);

  for (const sub of subscriptions) {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    };

    try {
      await webPush.sendNotification(pushSubscription, pushString);
      successCount++;

      // Update last_used_at timestamp
      await supabase
        .from('push_subscriptions')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', sub.id);
    } catch (err: any) {
      failureCount++;
      // If subscription expired or was unregistered by browser, delete it (HTTP 410 or 404)
      if (err.statusCode === 410 || err.statusCode === 404) {
        await supabase.from('push_subscriptions').delete().eq('id', sub.id);
      }
    }
  }

  // Also log into user's in-app notifications
  await supabase.from('notifications').insert({
    user_id: userId,
    type: payload.taskId?.includes('workout') ? 'workout' : payload.taskId?.includes('water') ? 'water' : 'system',
    title: payload.title,
    message: payload.body,
    deep_link: payload.url || '/dashboard',
    read: false,
  });

  return { successCount, failureCount };
}
