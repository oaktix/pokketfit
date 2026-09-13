/**
 * Authentication Strategy Configuration.
 * PRD Section 4 & 7:
 * - Current Production Release: 'AUTO_ACCEPT' (Instant activation upon registration; no OTP block).
 * - Future Email Verification: 'EMAIL_OTP' (Internal application-controlled OTP when Resend is connected).
 */
export type AuthStrategyMode = 'AUTO_ACCEPT' | 'EMAIL_OTP';

export const AUTH_CONFIG = {
  strategy: (process.env.AUTH_STRATEGY as AuthStrategyMode) || 'AUTO_ACCEPT',
  requireEmailVerification: false,
  defaultSessionExpiryDays: 30,
};

export function isOtpRequired(): boolean {
  return AUTH_CONFIG.strategy === 'EMAIL_OTP';
}
