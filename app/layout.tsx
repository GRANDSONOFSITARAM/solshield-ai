import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SolShield AI — Autonomous Solana DeFi Guardian & Trading Agent',
  description: 'Built for MLH Solana Hackathon 2026. Real-time byte-level token safety oracle, intent-based swaps with Jupiter, and deterministic risk guardrails.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b0e14] text-gray-100 flex flex-col antialiased selection:bg-solana-green selection:text-black">
        {children}
      </body>
    </html>
  );
}
