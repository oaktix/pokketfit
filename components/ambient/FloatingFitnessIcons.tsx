'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  Dumbbell, 
  Apple, 
  Flame, 
  Droplets, 
  Heart, 
  Trophy, 
  Activity, 
  Timer, 
  CheckCircle2, 
  Sparkles, 
  Footprints,
  UtensilsCrossed
} from 'lucide-react';

interface FloatingIconConfig {
  Icon: React.ElementType;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  yOffset: number;
  xOffset: number;
  rotation: number;
  opacity: number;
  colorClass: string;
}

const ICONS_CONFIG: FloatingIconConfig[] = [
  {
    Icon: Dumbbell,
    top: '12%',
    left: '8%',
    size: 28,
    duration: 11,
    delay: 0,
    yOffset: 14,
    xOffset: 8,
    rotation: 12,
    opacity: 0.18,
    colorClass: 'text-[#E37210]',
  },
  {
    Icon: Droplets,
    top: '20%',
    left: '88%',
    size: 24,
    duration: 9,
    delay: 1.2,
    yOffset: -12,
    xOffset: -6,
    rotation: -8,
    opacity: 0.15,
    colorClass: 'text-cyan-400',
  },
  {
    Icon: Flame,
    top: '38%',
    left: '12%',
    size: 26,
    duration: 13,
    delay: 0.5,
    yOffset: 16,
    xOffset: -8,
    rotation: 15,
    opacity: 0.16,
    colorClass: 'text-[#E37210]',
  },
  {
    Icon: Apple,
    top: '55%',
    left: '85%',
    size: 28,
    duration: 10,
    delay: 2.1,
    yOffset: -14,
    xOffset: 10,
    rotation: -14,
    opacity: 0.16,
    colorClass: 'text-emerald-400',
  },
  {
    Icon: Heart,
    top: '72%',
    left: '6%',
    size: 22,
    duration: 12,
    delay: 1.8,
    yOffset: 12,
    xOffset: 8,
    rotation: 10,
    opacity: 0.14,
    colorClass: 'text-rose-400',
  },
  {
    Icon: Trophy,
    top: '82%',
    left: '90%',
    size: 26,
    duration: 14,
    delay: 0.8,
    yOffset: -16,
    xOffset: -10,
    rotation: -10,
    opacity: 0.16,
    colorClass: 'text-amber-400',
  },
  {
    Icon: Activity,
    top: '28%',
    left: '4%',
    size: 24,
    duration: 11.5,
    delay: 2.4,
    yOffset: -10,
    xOffset: 6,
    rotation: 8,
    opacity: 0.12,
    colorClass: 'text-orange-300',
  },
  {
    Icon: Timer,
    top: '16%',
    left: '78%',
    size: 22,
    duration: 8.5,
    delay: 0.3,
    yOffset: 12,
    xOffset: -8,
    rotation: -12,
    opacity: 0.14,
    colorClass: 'text-[#FDBA74]',
  },
  {
    Icon: UtensilsCrossed,
    top: '68%',
    left: '92%',
    size: 22,
    duration: 10.5,
    delay: 1.5,
    yOffset: 14,
    xOffset: -6,
    rotation: 16,
    opacity: 0.14,
    colorClass: 'text-orange-400',
  },
  {
    Icon: Footprints,
    top: '46%',
    left: '94%',
    size: 24,
    duration: 12.5,
    delay: 2.8,
    yOffset: -14,
    xOffset: 6,
    rotation: -6,
    opacity: 0.13,
    colorClass: 'text-neutral-400',
  },
  {
    Icon: CheckCircle2,
    top: '88%',
    left: '14%',
    size: 20,
    duration: 9.8,
    delay: 1.0,
    yOffset: -10,
    xOffset: 6,
    rotation: 6,
    opacity: 0.14,
    colorClass: 'text-emerald-400',
  },
  {
    Icon: Sparkles,
    top: '7%',
    left: '92%',
    size: 20,
    duration: 7.5,
    delay: 0.6,
    yOffset: 8,
    xOffset: -6,
    rotation: 18,
    opacity: 0.18,
    colorClass: 'text-amber-300',
  },
];

export default function FloatingFitnessIcons() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div 
      className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0" 
      aria-hidden="true"
    >
      {ICONS_CONFIG.map((item, idx) => {
        const { Icon } = item;
        return (
          <motion.div
            key={idx}
            className={`absolute flex items-center justify-center ${item.colorClass}`}
            style={{
              top: item.top,
              left: item.left,
              opacity: item.opacity,
            }}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [-item.yOffset, item.yOffset, -item.yOffset],
                    x: [-item.xOffset, item.xOffset, -item.xOffset],
                    rotate: [-item.rotation, item.rotation, -item.rotation],
                  }
            }
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
          >
            <Icon size={item.size} strokeWidth={1.75} />
          </motion.div>
        );
      })}
    </div>
  );
}
