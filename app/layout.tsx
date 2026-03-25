import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PracticeOS — AI Operating System for Regenerative Medicine',
  description: 'The complete AI-powered operating system for regenerative and aesthetic medicine practices. Automate intake, follow-up, documentation, pricing, and marketing — built for practice owners who demand results.',
  keywords: 'regenerative medicine, aesthetic medicine, AI practice management, medical practice software, practice automation',
  openGraph: {
    title: 'PracticeOS — AI Operating System for Regenerative Medicine',
    description: 'Run your entire practice on AI. Built by Dr. Castillo after 20+ years in regenerative medicine.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
