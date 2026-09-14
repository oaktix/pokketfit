'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Flame, 
  Dumbbell, 
  LineChart, 
  Trophy, 
  User, 
  Utensils, 
  ShieldAlert,
  Wifi,
  WifiOff,
  ArrowLeft
} from 'lucide-react';
import { getLocalStore } from '@/lib/storage/store';

export default function MobileShell({ children, backHref }: { children: React.ReactNode; backHref?: string }) {
  const pathname = usePathname();
  const [isOffline, setIsOffline] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navItems = [
    { href: '/workouts', label: 'Workouts', icon: Dumbbell },
    { href: '/meals', label: 'Nutrition', icon: Utensils },
    { href: '/dashboard', label: 'Home', icon: Flame, center: true },
    { href: '/leaderboard', label: 'Leagues', icon: Trophy },
    { href: '/progress', label: 'Progress', icon: LineChart },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  // Hide navigation on onboarding, login, register, and admin
  const isExcluded = 
    pathname === '/' || 
    pathname.startsWith('/onboarding') || 
    pathname.startsWith('/login') || 
    pathname.startsWith('/register') || 
    pathname.startsWith('/admin');

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-start bg-[#0A0705] text-[#FAF8F5]">
      {/* Desktop simulated phone frame wrapper for pristine aesthetics on wide screens */}
      <div className="w-full max-w-md sm:max-w-[430px] md:max-w-md min-h-[100dvh] flex flex-col relative bg-[#110D0A] shadow-2xl border-x border-[#1E1914]">
        
        {/* Offline & Sync Status Banner (PRD Section 28 & 45) */}
        {isOffline && (
          <div className="bg-amber-900/80 backdrop-blur text-amber-200 px-4 py-2 text-xs flex items-center justify-between border-b border-amber-700/50 z-50">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Mode • Activity will sync when online</span>
            </div>
            <span className="font-semibold text-[10px] bg-amber-800/80 px-1.5 py-0.5 rounded">Queued</span>
          </div>
        )}

        {/* Header / Back Navigation */}
        {backHref && (
          <div className="sticky top-0 z-50 bg-[#110D0A]/95 backdrop-blur-md border-b border-[#2A241E]/50 px-3 sm:px-4 py-2 sm:py-3 flex items-center">
            <Link
              href={backHref}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#FAF8F5] hover:text-[#E37210] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 pb-24 overflow-y-auto">
          {children}
        </main>

        {/* Bottom Floating Navigation Bar (Matching Reference Mockups) */}
        {!isExcluded && (
          <nav className="fixed bottom-0 w-full max-w-md sm:max-w-[430px] md:max-w-md bg-[#16120E]/95 backdrop-blur-md border-t border-[#2A241E] px-3 sm:px-6 py-2 z-40">
            <div className="flex items-center justify-around">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center justify-center transition-all duration-200 ${
                      (item as any).center
                        ? 'relative z-10 -mt-4 scale-110'
                        : 'py-1 px-2'
                    } ${
                      isActive
                        ? (item as any).center ? 'text-[#E37210] font-extrabold' : 'text-[#E37210] font-semibold scale-105'
                        : 'text-[#8A8279] hover:text-[#C7BFB5]'
                    }`}
                  >
                    <div className={`${(item as any).center ? 'w-11 h-11 rounded-full bg-gradient-to-tr from-[#E37210] to-[#F2801E] shadow-glow-orange shadow-lg flex items-center justify-center' : ''}`}>
                      <Icon className={`w-5 h-5 ${(item as any).center ? 'text-white fill-white stroke-[2.5]' : isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                    </div>
                    <span className={`text-[10px] mt-1 tracking-tight ${(item as any).center ? 'font-extrabold' : ''}`}>{item.label}</span>
                    {isActive && !(item as any).center && (
                      <span className="w-1 h-1 bg-[#E37210] rounded-full mt-0.5" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
