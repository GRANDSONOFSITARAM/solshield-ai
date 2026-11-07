'use client';

import React, { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink, Binary, RefreshCw } from 'lucide-react';
import { oracle, POPULAR_TOKENS } from '../lib/solana/oracle';
import { TokenSecurityReport } from '../lib/solana/types';
import { ByteInspectorModal } from './ByteInspectorModal';

export const TokenScanner = () => {
  const [mintInput, setMintInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<TokenSecurityReport | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleScan = async (mintToScan?: string) => {
    const target = mintToScan || mintInput.trim();
    if (!target) return;

    setLoading(true);
    try {
      const res = await oracle.analyzeToken(target);
      setReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'SAFE':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> SAFE (LOW RISK)
          </span>
        );
      case 'CAUTION':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> CAUTION ADVISED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" /> CRITICAL RUG RISK
          </span>
        );
    }
  };

  return (
    <div className="bg-[#121824] border border-[#1f293d] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f293d] pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-solana-green" /> 7-Layer Token Safety Scanner
          </h2>
          <p className="text-xs text-gray-400">
            Audit any Solana token against raw SPL mint byte layouts before trading
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] text-gray-500 font-semibold uppercase">Presets:</span>
          <button
            onClick={() => {
              setMintInput('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
              handleScan('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1f293d] hover:bg-[#2a3750] text-gray-300 font-mono transition"
          >
            USDC (Safe)
          </button>
          <button
            onClick={() => {
              setMintInput('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
              handleScan('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1f293d] hover:bg-[#2a3750] text-gray-300 font-mono transition"
          >
            BONK
          </button>
          <button
            onClick={() => {
              setMintInput('ScamFreezeTokenMint111111111111111111111111');
              handleScan('ScamFreezeTokenMint111111111111111111111111');
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800 text-red-300 font-mono transition"
          >
            Simulated Rug ⚠️
          </button>
        </div>
      </div>

      {/* Input bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Solana SPL Token Mint Address (Base58)..."
          value={mintInput}
          onChange={(e) => setMintInput(e.target.value)}
          className="flex-1 bg-[#0b0e14] border border-[#1f293d] rounded-xl px-4 py-2.5 text-sm text-white focus:border-solana-green outline-none font-mono"
        />
        <button
          onClick={() => handleScan()}
          disabled={loading || !mintInput.trim()}
          className="px-5 py-2.5 rounded-xl bg-solana-gradient font-bold text-xs text-black uppercase tracking-wider hover:opacity-95 disabled:opacity-50 transition flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : 'Scan Token'}
        </button>
      </div>

      {/* Report view */}
      {report && (
        <div className="space-y-5 animate-fadeIn">
          {/* Header Card */}
          <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#1f293d] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg text-white">{report.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-[#1f293d] font-mono text-cyan-400">
                  {report.symbol}
                </span>
                {getVerdictBadge(report.verdict)}
              </div>
              <p className="text-xs font-mono text-gray-400 mt-1 break-all">
                Mint: {report.mint}
              </p>
            </div>

            {/* Score pill */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] uppercase font-semibold text-gray-400 block">
                  Safety Score
                </span>
                <span
                  className={`text-2xl font-black font-mono ${
                    report.safetyScore > 75
                      ? 'text-emerald-400'
                      : report.safetyScore > 50
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}
                >
                  {report.safetyScore}
                  <span className="text-xs text-gray-500 font-normal"> / 100</span>
                </span>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1f293d] hover:bg-[#2b3954] text-xs font-semibold text-cyan-300 border border-cyan-500/20 transition"
              >
                <Binary className="w-4 h-4" /> Inspect Bytes
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#0b0e14] rounded-xl border border-[#1f293d]">
              <span className="text-[11px] text-gray-400 block">Freeze Authority</span>
              <span
                className={`text-xs font-bold font-mono ${
                  report.hasFreezeAuthority ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {report.hasFreezeAuthority ? 'ACTIVE (DANGER)' : 'REVOKED (CLEAN)'}
              </span>
            </div>

            <div className="p-3 bg-[#0b0e14] rounded-xl border border-[#1f293d]">
              <span className="text-[11px] text-gray-400 block">Mint Authority</span>
              <span
                className={`text-xs font-bold font-mono ${
                  report.hasMintAuthority ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {report.hasMintAuthority ? 'ACTIVE (UNCAPPED)' : 'REVOKED (FIXED)'}
              </span>
            </div>

            <div className="p-3 bg-[#0b0e14] rounded-xl border border-[#1f293d]">
              <span className="text-[11px] text-gray-400 block">Top 10 Concentration</span>
              <span className="text-xs font-bold font-mono text-gray-200">
                {report.top10HoldersPercentage}%
              </span>
            </div>

            <div className="p-3 bg-[#0b0e14] rounded-xl border border-[#1f293d]">
              <span className="text-[11px] text-gray-400 block">Liquidity Pool (USD)</span>
              <span className="text-xs font-bold font-mono text-gray-200">
                ${report.liquidityUsd.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Risk Flags List */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
              Security Flags & Indicators
            </span>
            <div className="space-y-2">
              {report.riskFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    flag.level === 'critical'
                      ? 'bg-red-950/30 border-red-800/60 text-red-300'
                      : flag.level === 'warning'
                      ? 'bg-yellow-950/30 border-yellow-800/60 text-yellow-300'
                      : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                  }`}
                >
                  {flag.level === 'critical' ? (
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  ) : flag.level === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="font-semibold block">{flag.title}</strong>
                    <span className="text-[11px] text-gray-300">{flag.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <ByteInspectorModal
        report={report}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};
