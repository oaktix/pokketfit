'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

/**
 * Emil Kowalski & Taste-Skill compliant motion configuration.
 * - Respects prefers-reduced-motion
 * - Snappy durations: 160ms - 260ms
 * - Custom cubic curves (ease-out for entry, custom spring for tactile feedback)
 */

export const springTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const snappyEaseOut = [0.23, 1, 0.32, 1] as const; // Quick start, graceful settling

/**
 * Stagger Container for list & dashboard cards
 */
export function StaggerContainer({
  children,
  className,
  delay = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Item for individual cards
 */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.28,
            ease: snappyEaseOut,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Tactile Button with 0.97 press scale and subtle elevation feedback
 */
export function TactileButton({
  children,
  onClick,
  className,
  disabled,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.015 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      transition={{ duration: 0.14, ease: snappyEaseOut }}
      className={cn(
        'relative select-none font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
    >
      {children}
    </motion.button>
  );
}

/**
 * Fade & Slide Up entrance for cards or dynamic sections
 */
export function FadeSlideUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.26, delay, ease: snappyEaseOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scale in for badges, modal dialogs, and checkmarks
 */
export function ScaleIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.24, delay, ease: snappyEaseOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated number count up / count down
 */
export function NumberCountUp({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = displayValue;
    const endVal = value;
    const duration = 350; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * easeOut;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  return (
    <span className={className}>
      {prefix}
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * Animated Checkmark for habit and task completion
 */
export function AnimatedCheckmark({
  size = 20,
  strokeColor = '#FFFFFF',
}: {
  size?: number;
  strokeColor?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M5 13L9.5 17.5L19 7"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      />
    </svg>
  );
}
