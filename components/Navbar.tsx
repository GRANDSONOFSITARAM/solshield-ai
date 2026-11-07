'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { ShieldCheck, Activity, Cpu } from 'lucide-react';
import { useSolanaNetwork } from './WalletContextProvider';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

// Dynamically import WalletMultiButton with SSR disabled to prevent hydration ChunkLoadError
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  {
    ssr: false,
    loading: () => (
      <button className="bg-solana-gradient text-black font-bold text-xs h-9 px-4 rounded-xl opacity-80 cursor-wait">
        Select Wallet
      </button>
    ),
  }
);

export const Navbar = () => {
  const { connected } = useWallet();
  const { network, setNetwork } = useSolanaNetwork();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b0e14]/80 border-b border-[#1f293d] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-solana-gradient p-[1.5px] flex items-center justify-center shadow-lg shadow-solana-green/20">
            <div className="w-full h-full bg-[#0b0e14] rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-solana-green" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                SolShield <span className="text-solana-green">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-solana-purple/20 text-[#c084fc] border border-solana-purple/30">
                Solana MLH 2026
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Autonomous DeFi Guardian & Intent-Based Trading Agent
            </p>
          </div>
        </div>

        {/* Center Indicators */}
        <div className="hidden md:flex items-center gap-4 bg-[#121824] px-3 py-1.5 rounded-xl border border-[#1f293d] text-xs">
          <div className="flex items-center gap-1.5 text-gray-300">
            <Activity className="w-3.5 h-3.5 text-solana-green animate-pulse" />
            <span>400ms Sub-Cent RPC</span>
          </div>
          <span className="text-gray-600">|</span>
          <div className="flex items-center gap-1.5 text-gray-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>MCP Agent Online</span>
          </div>
        </div>

        {/* Actions: Network Switcher & Wallet */}
        <div className="flex items-center gap-3">
          {/* Network Selector */}
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value as WalletAdapterNetwork)}
            className="bg-[#121824] text-xs font-semibold text-gray-300 border border-[#1f293d] rounded-xl px-2.5 py-2 outline-none focus:border-solana-green transition"
          >
            <option value={WalletAdapterNetwork.Devnet}>Solana Devnet</option>
            <option value={WalletAdapterNetwork.Mainnet}>Solana Mainnet</option>
            <option value={WalletAdapterNetwork.Testnet}>Solana Testnet</option>
          </select>

          {/* Wallet Button */}
          <WalletMultiButtonDynamic className="!bg-solana-gradient !text-black !font-bold !text-xs !h-9 !px-4 !rounded-xl !shadow-md hover:!opacity-95" />
        </div>
      </div>
    </header>
  );
};
