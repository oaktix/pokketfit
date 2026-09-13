'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Check, Flame, Droplets, Dumbbell, Apple, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export interface NotificationItem {
  id: string;
  type: 'workout' | 'meal' | 'fruit' | 'water' | 'streak' | 'achievement' | 'league' | 'system';
  title: string;
  message: string;
  deepLink?: string;
  read: boolean;
  createdAt: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'workout',
    title: "Today's Prescribed Session",
    message: 'Your coach has prepared your Lower Body routine. Build strong habits today!',
    deepLink: '/workouts',
    read: false,
    createdAt: '10 mins ago',
  },
  {
    id: 'notif-2',
    type: 'water',
    title: 'Hydration Target',
    message: "You're 1.25L away from hitting your 2.5L daily hydration target. Keep sipping!",
    deepLink: '/dashboard',
    read: false,
    createdAt: '1 hour ago',
  },
  {
    id: 'notif-3',
    type: 'fruit',
    title: 'Fresh Fruit Portion',
    message: "Don't forget your fresh Papaya serving today for micronutrients and digestive vitality.",
    deepLink: '/meals',
    read: true,
    createdAt: '3 hours ago',
  },
  {
    id: 'notif-4',
    type: 'streak',
    title: '14-Day Streak Unlocked! 🔥',
    message: 'Consistency is showing. You maintained your active habit streak for 2 full weeks.',
    deepLink: '/leaderboard',
    read: true,
    createdAt: 'Yesterday',
  },
];

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'workout':
        return <Dumbbell className="w-4 h-4 text-[#E37210]" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'fruit':
        return <Apple className="w-4 h-4 text-emerald-400" />;
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#FDBA74]" />;
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-sm h-full bg-[#16120E] border-l border-[#2A241E] p-5 flex flex-col justify-between shadow-2xl"
        >
          {/* Top Bar */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#2A241E]">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-[#E37210]" />
                <h3 className="text-base font-black text-white tracking-tight">Notification Center</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-extrabold bg-[#E37210] text-white px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-[#1E1914] text-[#8A8279] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-xs text-[#8A8279]">Recent Coach Reminders</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-bold text-[#E37210] hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="space-y-2.5 overflow-y-auto max-h-[calc(100dvh-180px)] pr-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    n.read
                      ? 'bg-[#110D0A] border-[#2A241E]/70 opacity-80'
                      : 'bg-[#1E1914] border-[#E37210]/40 shadow-glow-subtle'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-xl bg-[#16120E] flex items-center justify-center">
                        {getIcon(n.type)}
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{n.title}</h4>
                    </div>
                    <span className="text-[9px] text-[#706760]">{n.createdAt}</span>
                  </div>

                  <p className="text-xs text-[#A8A096] mt-2 leading-relaxed">
                    {n.message}
                  </p>

                  {n.deepLink && (
                    <Link
                      href={n.deepLink}
                      onClick={onClose}
                      className="mt-3 inline-flex items-center space-x-1 text-[11px] font-bold text-[#E37210] hover:text-[#F2801E]"
                    >
                      <span>View Task</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer sleep policy note */}
          <div className="pt-4 border-t border-[#2A241E] text-[10px] text-[#706760] text-center">
            Pokketfit respects your sleep window and suppresses all push reminders during configured bedtime hours.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
