import type { Metadata } from 'next';
import Link from 'next/link';
import { Flame, ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — PokketFit',
  description:
    'How PokketFit collects, uses, and protects your personal health and fitness data. Read our full privacy policy.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'September 2026';

  return (
    <div className="min-h-[100dvh] bg-[#0A0705] text-[#FAF8F5] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0705]/90 backdrop-blur-xl border-b border-white/[0.07] px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#E37210] flex items-center justify-center">
              <Flame className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">POKKETFIT</span>
          </Link>
          <Link
            href="/"
            className="flex items-center space-x-1.5 text-xs font-semibold text-[#8A8279] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to site</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* Title block */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#E37210]" />
            <span className="text-xs font-bold text-[#E37210] uppercase tracking-widest">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#8A8279]">Last updated: {lastUpdated}</p>
        </div>

        <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 text-sm text-[#A8A096] leading-relaxed">
          PokketFit is a wellness coaching tool — not a clinical medical service. We are committed
          to protecting your personal health data with transparency and care. This policy explains
          what we collect, why we collect it, and how you can control it.
        </div>

        <LegalSection title="1. Information We Collect">
          <p>We collect the following categories of information when you use PokketFit:</p>
          <ul>
            <li>
              <strong>Account data</strong> — your name, email address, and password (securely
              hashed via Supabase Auth).
            </li>
            <li>
              <strong>Health &amp; fitness data</strong> — age, gender, height, weight, BMI,
              fitness goals, workout history, hydration logs, meal completions, and daily habit
              records.
            </li>
            <li>
              <strong>Device data</strong> — browser type, operating system, and push notification
              subscription credentials (only when you opt in).
            </li>
            <li>
              <strong>Usage data</strong> — engagement events, points earned, streak records, and
              plan completion state, stored locally and optionally synced to our servers.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="2. How We Use Your Data">
          <ul>
            <li>To generate your personalised daily fitness and nutrition plan.</li>
            <li>To track your progress, streaks, and habit completion over time.</li>
            <li>To send optional push notifications for workout and hydration reminders.</li>
            <li>To maintain your account and authenticate you securely.</li>
            <li>To calculate BMI and recommend goal categories (using WHO standard formulas).</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your data to third parties. We do not use your health
            data for advertising purposes.
          </p>
        </LegalSection>

        <LegalSection title="3. Data Storage &amp; Security">
          <p>
            Your account credentials and profile data are stored in{' '}
            <strong>Supabase</strong> — a trusted, SOC 2 Type II certified cloud database provider
            hosted on AWS. All data is encrypted in transit (TLS) and at rest.
          </p>
          <p>
            Row Level Security (RLS) policies ensure that your data is only accessible to your own
            authenticated account. No other user can read, write, or modify your records.
          </p>
          <p>
            Local app data (offline logs, session state) is stored in your browser&apos;s
            localStorage and never transmitted without your consent.
          </p>
        </LegalSection>

        <LegalSection title="4. Push Notifications">
          <p>
            If you grant push notification permission, we store a push subscription token in our
            database to deliver workout reminders. You can revoke this permission at any time
            through your device or browser settings. We will never send unsolicited or marketing
            push notifications.
          </p>
        </LegalSection>

        <LegalSection title="5. Your Rights (NDPR &amp; GDPR)">
          <p>
            Under the Nigerian Data Protection Regulation (NDPR) and the EU General Data Protection
            Regulation (GDPR), you have the following rights:
          </p>
          <ul>
            <li>
              <strong>Access</strong> — request a copy of your data via the Profile &rarr; Export
              Fitness History function.
            </li>
            <li>
              <strong>Correction</strong> — update your profile data at any time from the app.
            </li>
            <li>
              <strong>Deletion</strong> — delete your local data via Profile &rarr; Reset Local
              Data. To permanently delete your Supabase account record, contact us at the email
              below.
            </li>
            <li>
              <strong>Portability</strong> — export your data as JSON from the Profile page.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="6. Third-Party Services">
          <p>PokketFit uses the following trusted third-party services:</p>
          <ul>
            <li>
              <strong>Supabase</strong> — authentication and database (
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E37210] underline"
              >
                Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong>Cloudinary</strong> — exercise video and image delivery
            </li>
            <li>
              <strong>Vercel</strong> — application hosting and edge delivery
            </li>
          </ul>
          <p>
            None of these services have access to your personal health data beyond what is
            technically required for the service to function.
          </p>
        </LegalSection>

        <LegalSection title="7. Children">
          <p>
            PokketFit is intended for adults aged 18 and above. Our onboarding process enforces
            this requirement. We do not knowingly collect data from anyone under 18.
          </p>
        </LegalSection>

        <LegalSection title="8. Changes to This Policy">
          <p>
            We may update this policy from time to time. Significant changes will be communicated
            via the app or to your registered email. Continued use of PokketFit after updates
            constitutes acceptance of the revised policy.
          </p>
        </LegalSection>

        <LegalSection title="9. Contact Us">
          <p>
            For privacy-related questions, data access requests, or account deletion, contact:
          </p>
          <p>
            <strong>PokketFit Data Team</strong>
            <br />
            <a href="mailto:privacy@pokketfit.app" className="text-[#E37210] underline">
              privacy@pokketfit.app
            </a>
          </p>
        </LegalSection>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#706760]">
          <span>© {new Date().getFullYear()} PokketFit. All rights reserved.</span>
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="text-[#E37210]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Reusable section component ───────────────────────────────────────────────

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
      <div className="text-sm text-[#A8A096] leading-relaxed space-y-3 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:text-[#C7BFB5] [&_a]:text-[#E37210]">
        {children}
      </div>
    </section>
  );
}
