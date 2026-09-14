'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppNavigation } from './hooks/useAppNavigation';

interface AppBackButtonProps {
  fallback?: string;
  className?: string;
  label?: string;
  variant?: 'default' | 'website';
}

export default function AppBackButton({
  fallback = '/dashboard',
  className = '',
  label,
  variant = 'default',
}: AppBackButtonProps) {
  const { goBack, goToWebsite } = useAppNavigation(fallback);

  if (variant === 'website') {
    return (
      <button
        onClick={goToWebsite}
        className={`inline-flex items-center space-x-1 text-xs font-semibold text-[#E37210] hover:text-[#F2801E] transition-colors ${className}`}
        aria-label="Back to website"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {label ? <span>{label}</span> : <span>Back to website</span>}
      </button>
    );
  }

  return (
    <button
      onClick={goBack}
      className={`inline-flex items-center justify-center p-2 rounded-xl bg-[#16120E] border border-[#2A241E] text-[#FAF8F5] hover:border-[#3F3730] transition-colors ${className}`}
      aria-label={label || 'Go back'}
      title={label || 'Go back'}
    >
      <ArrowLeft className="w-5 h-5" />
      {label && <span className="ml-2 text-xs font-semibold">{label}</span>}
    </button>
  );
}
