'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react';

interface PortfolioToken {
  name: string;
  symbol: string;
  balance: string;
  valueUsd: number;
  safetyScore: number;
  freezeAuthority: boolean;
  mintAuthority: boolean;
}

const DEMO_PORTFOLIO: PortfolioToken[] = [
  {
    name: 'Solana',
    symbol: 'SOL',
    balance: '4.85 SOL',
    valueUsd: 873.0,
    safetyScore: 100,
    freezeAuthority: false,
    mintAuthority: false,
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    balance: '250.00 USDC',
    valueUsd: 250.0,
    safetyScore: 98,
    freezeAuthority: false,
    mintAuthority: false,
  },
  {
    name: 'Bonk',
    symbol: 'BONK',
    balance: '12,500,000 BONK',
    valueUsd: 287.5,
    safetyScore: 90,
    freezeAuthority: false,
    mintAuthority: false,
  },
  {
    name: 'Suspicious Airdrop Token',
    symbol: 'AIRFREEZE',
    balance: '500,000 AIR',
    valueUsd: 0.0,
    safetyScore: 8,
    freezeAuthority: true,
    mintAuthority: true,
  },
];

export const PortfolioRadar = () => {
  const totalValue = DEMO_PORTFOLIO.reduce((sum, t) => sum + t.valueUsd, 0);
  const weightedSafety = Math.round(
    DEMO_PORTFOLIO.reduce((sum, t) => sum + (t.valueUsd > 0 ? t.safetyScore * t.valueUsd : 0), 0) /
      (totalValue || 1)
  );

  return (
    <div className="bg-[#121824] border border-[#1f293d] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f293d] pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-solana-green" /> Wallet Risk & Health Radar
          </h2>
          <p className="text-xs text-gray-400">
            Real-time security index of all tokens held in your connected Solana account
          </p>
        </div>

        {/* Aggregate Health */}
        <div className="flex items-center gap-3 bg-[#0b0e14] px-4 py-2 rounded-xl border border-[#1f293d]">
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">
              Portfolio Health Index
            </span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              {weightedSafety} / 100 (Optimal)
            </span>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
      </div>

      {/* Asset Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#1f293d] text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-3">Asset</th>
              <th className="pb-3">Balance</th>
              <th className="pb-3">Value</th>
              <th className="pb-3">Safety Score</th>
              <th className="pb-3">Authorities</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f293d]/50 font-mono">
            {DEMO_PORTFOLIO.map((t, idx) => (
              <tr key={idx} className="hover:bg-[#182030] transition">
                <td className="py-3 font-sans">
                  <div className="font-bold text-white flex items-center gap-2">
                    {t.name}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1f293d] text-cyan-400">
                      {t.symbol}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-gray-300">{t.balance}</td>
                <td className="py-3 text-white font-bold">${t.valueUsd.toFixed(2)}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      t.safetyScore > 75
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {t.safetyScore} / 100
                  </span>
                </td>
                <td className="py-3">
                  {t.freezeAuthority ? (
                    <span className="text-red-400 text-[11px] flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> Freeze Active
                    </span>
                  ) : (
                    <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Clean Bytes
                    </span>
                  )}
                </td>
                <td className="py-3 text-right font-sans">
                  {t.freezeAuthority ? (
                    <span className="text-xs font-bold text-red-400">Flagged Rug</span>
                  ) : (
                    <button className="text-xs font-bold text-solana-green hover:underline flex items-center gap-1 ml-auto">
                      Swap <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
