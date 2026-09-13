'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Menu, X, ArrowRight, Dumbbell, Apple, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePWAInstall } from '@/lib/pwa/usePWAInstall';

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isStandalone, triggerManualPrompt } = usePWAInstall();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Workouts', href: '#workouts' },
    { label: 'Nutrition', href: '#nutrition' },
    { label: 'Habits', href: '#habits' },
    { label: 'Progress', href: '#progress' },
    { label: 'Leagues', href: '#leagues' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0A0705]/85 dark:bg-[#0A0705]/90 light:bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-white/[0.08] dark:border-white/[0.08] light:border-black/[0.06] shadow-sm py-3' 
          : 'bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* LEFT: Brand Lockup */}
        <Link href="/" className="flex items-center space-x-2.5 group focus:outline-none">
          <div className="w-10 h-10 rounded-2xl bg-[#E37210] flex items-center justify-center">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg md:text-xl tracking-tight text-white dark:text-white light:text-[#1A140F]">
              POKKETFIT
            </span>
            <span className="text-[10px] text-[#E37210] uppercase tracking-widest font-bold -mt-0.5">
              Coach In Your Pocket
            </span>
          </div>
        </Link>

        {/* CENTER: Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-[#16120E]/70 dark:bg-[#16120E]/70 light:bg-black/[0.04] backdrop-blur-md px-4 py-1.5 rounded-full border border-white/[0.08] dark:border-white/[0.08] light:border-black/[0.06]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-semibold text-[#A8A096] dark:text-[#A8A096] light:text-[#706760] hover:text-white dark:hover:text-white light:hover:text-[#1A140F] px-3 py-1.5 rounded-full transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* RIGHT: Mobile Menu Trigger */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center space-x-1.5 text-xs font-bold text-white bg-[#E37210] hover:bg-[#F2801E] px-5 py-2.5 rounded-full transition-colors"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* MOBILE: Menu Trigger Only */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-[#16120E] border border-white/[0.1] text-white p-2 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDABLE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden bg-[#0A0705]/98 backdrop-blur-2xl border-b border-white/[0.08] px-6 py-6 overflow-hidden"
          >
            <div className="space-y-4">
              <div className="text-[11px] font-bold text-[#E37210] uppercase tracking-widest">
                Navigation
              </div>
              <div className="grid grid-cols-1 gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#16120E] border border-white/[0.06] text-sm font-semibold text-white hover:border-[#E37210]/40 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#8A8279]" />
                  </a>
                ))}
              </div>

              <div className="pt-2 border-t border-white/[0.08] space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[44px] flex items-center justify-center text-sm font-bold text-[#FAF8F5] bg-[#16120E] border border-white/[0.08] rounded-2xl py-3 transition-colors hover:border-[#E37210]/40"
                >
                  <span>Log In</span>
                </Link>

                <Link
                  href="/onboarding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[44px] flex items-center justify-center space-x-2 text-sm font-bold text-white bg-[#E37210] hover:bg-[#F2801E] rounded-2xl py-3 transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
