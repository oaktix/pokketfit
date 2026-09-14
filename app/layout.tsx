import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pokketfit — Your Personal Fitness Coach in Your Pocket',
  description:
    'Personalized daily workouts, Nigerian nutrition meal plans, hydration tracking, fruit intake, and consistent habit coaching.',
  manifest: '/manifest.json',
  icons: {
    icon: '/flame.svg',
    apple: '/flame.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0705',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';
import InstallPrompt from '@/components/mobile/InstallPrompt';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-[100dvh] antialiased bg-[#0A0705] text-[#FAF8F5] font-sans selection:bg-[#E37210]/30 selection:text-[#FDBA74]">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <InstallPrompt />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
