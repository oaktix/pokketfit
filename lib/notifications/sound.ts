'use client';

export function playSound(type: 'notification' | 'splash' | 'munch' | 'applause' = 'notification') {
  if (typeof window === 'undefined' || !('Audio' in window)) return;
  try {
    const map: Record<string, string> = {
      notification: '/notification.wav',
      splash: '/splash.wav',
      munch: '/munch.wav',
      applause: '/applause.wav',
    };
    const audio = new Audio(map[type] || map.notification);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  } catch {
    // Silently fail
  }
}

export function playNotificationSound() {
  playSound('notification');
}
