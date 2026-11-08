'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the entire app shell (wallet providers + navbar + content)
// with SSR completely disabled to prevent chunk loading errors from
// @solana/wallet-adapter-wallets which pulls in WalletConnect, Ledger, etc.
const AppShell = dynamic(() => import('@/components/AppShell'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#14F195] p-[2px] animate-pulse">
          <div className="w-full h-full bg-[#0b0e14] rounded-xl flex items-center justify-center">
            <span className="text-[#14F195] text-xl font-bold">⛨</span>
          </div>
        </div>
        <p className="text-gray-400 text-sm font-mono animate-pulse">
          Loading SolShield AI...
        </p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <AppShell />;
}
