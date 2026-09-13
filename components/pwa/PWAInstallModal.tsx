'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Flame, Download, X, Share2, PlusSquare, ArrowRight, Smartphone, Sparkles } from 'lucide-react';
import { usePWAInstall } from '@/lib/pwa/usePWAInstall';

export default function PWAInstallModal() {
  const { showInstallPrompt, isIOS, install, dismiss, isStandalone } = usePWAInstall();
  const shouldReduceMotion = useReducedMotion();

  if (isStandalone || !showInstallPrompt) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="w-full sm:max-w-md bg-[#16120E] border border-white/[0.1] rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#E37210]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#1E1914] text-[#8A8279] hover:text-white transition-colors focus:outline-none"
            aria-label="Dismiss installation prompt"
          >
            <X className="w-4 h-4" />
          </button>

          {/* App Brand Presentation */}
          <div className="flex items-center space-x-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E37210] to-[#F97316] flex items-center justify-center shadow-glow-orange shrink-0">
              <Flame className="w-7 h-7 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base text-white tracking-tight">POKKETFIT</span>
                <span className="text-[10px] font-bold text-[#E37210] bg-[#E37210]/15 px-2 py-0.5 rounded-full">
                  PWA
                </span>
              </div>
              <p className="text-xs text-[#8A8279]">Your Personal Fitness Coach</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2 mb-5">
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Take PokketFit with you.
            </h3>
            <p className="text-xs text-[#A8A096] leading-relaxed">
              Install PokketFit on your device for instant offline access to your workouts, daily Nigerian nutrition, hydration reminders, and habit tracking.
            </p>
          </div>

          {/* iOS Safari Guided Steps */}
          {isIOS ? (
            <div className="bg-[#110D0A] border border-white/[0.08] rounded-2xl p-4 space-y-2.5 mb-5 text-xs text-[#D5D1CB]">
              <div className="text-[11px] font-bold text-[#E37210] uppercase tracking-wider mb-1 flex items-center space-x-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>How to Install on iOS:</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#1E1914] flex items-center justify-center text-[#E37210] shrink-0 font-bold text-xs">
                  1
                </div>
                <span>
                  Tap the <Share2 className="w-3.5 h-3.5 inline mx-1 text-cyan-400" /> <strong>Share</strong> button in Safari's toolbar.
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#1E1914] flex items-center justify-center text-[#E37210] shrink-0 font-bold text-xs">
                  2
                </div>
                <span>
                  Scroll and select <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-[#E37210]" /> <strong>Add to Home Screen</strong>.
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#1E1914] flex items-center justify-center text-[#E37210] shrink-0 font-bold text-xs">
                  3
                </div>
                <span>
                  Tap <strong>Add</strong> in the top right corner.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-[#110D0A] border border-white/[0.08] rounded-2xl p-3 flex items-center space-x-3 mb-5 text-xs text-[#8A8279]">
              <Sparkles className="w-4 h-4 text-[#E37210] shrink-0" />
              <span>Works like a native app on your home screen with zero app store downloads.</span>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-2.5">
            {isIOS ? (
              <button
                onClick={dismiss}
                className="w-full min-h-[46px] rounded-2xl bg-gradient-to-r from-[#E37210] to-[#F2801E] text-white text-xs font-bold shadow-glow-orange active:scale-[0.98] transition-all"
              >
                Got It, Thanks
              </button>
            ) : (
              <button
                onClick={install}
                className="w-full min-h-[46px] rounded-2xl bg-gradient-to-r from-[#E37210] to-[#F2801E] hover:from-[#EA7A15] hover:to-[#F88B2A] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-glow-orange active:scale-[0.98] transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Install PokketFit</span>
              </button>
            )}

            <button
              onClick={dismiss}
              className="w-full min-h-[40px] rounded-xl text-xs font-semibold text-[#8A8279] hover:text-white transition-colors"
            >
              Not now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
