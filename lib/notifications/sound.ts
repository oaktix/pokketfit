'use client';

export function playNotificationSound() {
  if (typeof window === 'undefined' || !('Audio' in window)) return;
  try {
    const audio = new Audio('/notification.wav');
    audio.volume = 0.6;
    audio.play().catch(() => {
      // Ignore autoplay restrictions
    });
  } catch {
    // Silently fail
  }
}

export function playActionSound() {
  playNotificationSound();
}
