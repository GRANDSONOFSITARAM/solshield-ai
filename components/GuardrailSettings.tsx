'use client';

import React, { useState } from 'react';
import { ShieldCheck, Sliders, AlertTriangle, Lock, RefreshCw, Check } from 'lucide-react';
import { GuardrailPolicy } from '../lib/solana/types';

interface GuardrailSettingsProps {
  policy: GuardrailPolicy;
  onUpdatePolicy: (updated: GuardrailPolicy) => void;
}

export const GuardrailSettings: React.FC<GuardrailSettingsProps> = ({ policy, onUpdatePolicy }) => {
  const [formData, setFormData] = useState<GuardrailPolicy>(policy);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePolicy(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const dailyUsagePercent = Math.min(
    100,
    Math.round((formData.currentDailySpentSol / formData.maxDailySpendSol) * 100)
  );

  return (
    <div className="bg-[#121824] border border-[#1f293d] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-[#1f293d] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-solana-green/10 border border-solana-green/30 flex items-center justify-center text-solana-green">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Autonomous Policy & Guardrails</h2>
            <p className="text-xs text-gray-400">
              Set deterministic constraints that your AI agent cannot violate
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({ ...formData, currentDailySpentSol: 0 });
            onUpdatePolicy({ ...formData, currentDailySpentSol: 0 });
          }}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1f293d] text-gray-300 hover:text-white transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Daily
        </button>
      </div>

      {/* Daily Spend Gauge */}
      <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#1f293d] space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-medium">Daily Spend Allowance:</span>
          <span className="text-white font-bold font-mono">
            {formData.currentDailySpentSol.toFixed(2)} / {formData.maxDailySpendSol} SOL ({dailyUsagePercent}%)
          </span>
        </div>
        <div className="w-full bg-[#1f293d] h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              dailyUsagePercent > 80 ? 'bg-red-500' : 'bg-solana-gradient'
            }`}
            style={{ width: `${dailyUsagePercent}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Max Spend per Trade */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">
              Max Spend Per Trade (SOL)
            </label>
            <input
              type="number"
              step="0.05"
              min="0.01"
              value={formData.maxSpendPerTradeSol}
              onChange={(e) =>
                setFormData({ ...formData, maxSpendPerTradeSol: parseFloat(e.target.value) || 0.1 })
              }
              className="w-full bg-[#0b0e14] border border-[#1f293d] rounded-xl px-3 py-2 text-sm text-white focus:border-solana-green outline-none font-mono"
            />
            <p className="text-[11px] text-gray-500">
              Agent will reject any single intent requiring more than this amount.
            </p>
          </div>

          {/* Max Daily Cap */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">
              Max Daily Allowance (SOL)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.1"
              value={formData.maxDailySpendSol}
              onChange={(e) =>
                setFormData({ ...formData, maxDailySpendSol: parseFloat(e.target.value) || 1.0 })
              }
              className="w-full bg-[#0b0e14] border border-[#1f293d] rounded-xl px-3 py-2 text-sm text-white focus:border-solana-green outline-none font-mono"
            />
            <p className="text-[11px] text-gray-500">
              Hard 24-hour limit preventing rogue bot loops or drainers.
            </p>
          </div>
        </div>

        {/* Safety Threshold */}
        <div className="space-y-2 p-4 bg-[#0b0e14] rounded-xl border border-[#1f293d]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-solana-green" />
              Minimum Token Safety Score Required
            </label>
            <span className="font-mono font-bold text-sm text-solana-green">
              {formData.minSafetyScoreRequired} / 100
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="95"
            value={formData.minSafetyScoreRequired}
            onChange={(e) =>
              setFormData({ ...formData, minSafetyScoreRequired: parseInt(e.target.value) })
            }
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <p className="text-[11px] text-gray-500">
            Tokens scoring below this threshold will be flagged as DANGEROUS and automatically declined.
          </p>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#0b0e14] border border-[#1f293d] cursor-pointer hover:border-gray-600 transition">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-semibold text-gray-200 block">
                  Auto-Block Active Freeze Authorities
                </span>
                <span className="text-[11px] text-gray-400">
                  Instant veto if token creator retains authority to freeze user balances.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.autoRejectFreezeAuthority}
              onChange={(e) =>
                setFormData({ ...formData, autoRejectFreezeAuthority: e.target.checked })
              }
              className="w-4 h-4 accent-solana-green rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#0b0e14] border border-[#1f293d] cursor-pointer hover:border-gray-600 transition">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <div>
                <span className="text-xs font-semibold text-gray-200 block">
                  Auto-Block Active Mint Authorities
                </span>
                <span className="text-[11px] text-gray-400">
                  Veto tokens whose supply can be arbitrarily inflated by the creator.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.autoRejectMintAuthority}
              onChange={(e) =>
                setFormData({ ...formData, autoRejectMintAuthority: e.target.checked })
              }
              className="w-4 h-4 accent-solana-green rounded"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-solana-gradient font-bold text-xs text-black uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-black" /> Policies Saved to Guardian
            </>
          ) : (
            'Apply Safety Guardrails'
          )}
        </button>
      </form>
    </div>
  );
};
