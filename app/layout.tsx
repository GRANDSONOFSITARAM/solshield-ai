import type { Metadata } from 'next';
import './globals.css';
import { WalletContextProvider } from '@/components/WalletContextProvider';
import { Navbar } from '@/components/Navbar';

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
        <WalletContextProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <footer className="border-t border-[#1f293d] py-6 px-4 text-center text-xs text-gray-500 bg-[#0b0e14]">
            <p>
              Built for the <strong className="text-gray-300">MLH Solana Hackathon 2026</strong>. Powered by Solana Web3, Jupiter DEX Aggregator & Model Context Protocol.
            </p>
          </footer>
        </WalletContextProvider>
      </body>
    </html>
  );
}
