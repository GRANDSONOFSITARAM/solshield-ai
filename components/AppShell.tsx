'use client';

import React, { useState } from 'react';
import { WalletContextProvider } from '@/components/WalletContextProvider';
import { Navbar } from '@/components/Navbar';
import { Bot, Shield, Sliders, TrendingUp, Sparkles, Award, Zap } from 'lucide-react';
import { AgentChat } from '@/components/AgentChat';
import { TokenScanner } from '@/components/TokenScanner';
import { GuardrailSettings } from '@/components/GuardrailSettings';
import { PortfolioRadar } from '@/components/PortfolioRadar';
import { DEFAULT_GUARDRAILS } from '@/lib/agent/guardrails';
import { GuardrailPolicy } from '@/lib/solana/types';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'agent' | 'scanner' | 'guardrails' | 'portfolio'>('agent');
  const [policy, setPolicy] = useState<GuardrailPolicy>(DEFAULT_GUARDRAILS);

  const handleUpdatePolicy = (updated: GuardrailPolicy) => {
    setPolicy(updated);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Hero Announcement Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-solana-purple/20 via-[#121824] to-solana-green/20 border border-[#1f293d] p-6 lg:p-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-solana-green/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solana-green/10 border border-solana-green/30 text-solana-green text-xs font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" /> Built for MLH Solana Hackathon 2026
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Autonomous DeFi Guardian with{' '}
                  <span className="bg-gradient-to-r from-solana-green via-cyan-400 to-solana-purple bg-clip-text text-transparent">
                    Byte-Level Safety Gates
                  </span>
                </h1>
                <p className="text-sm text-gray-300 leading-relaxed">
                  SolShield AI combines autonomous LLM intent parsing with raw 82-byte SPL Token Mint deserialization. It verifies active freeze and mint authorities, queries Jupiter DEX liquidity, and enforces deterministic spending caps—all settled at Solana speed in 400ms.
                </p>
              </div>

              {/* Hackathon Track Badges */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                <div className="px-4 py-2.5 rounded-xl bg-[#0b0e14]/80 border border-cyan-500/30 text-xs font-bold text-cyan-300 flex items-center gap-2 shadow-sm">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> AI Track Top Prize Contender
                </div>
                <div className="px-4 py-2.5 rounded-xl bg-[#0b0e14]/80 border border-solana-green/30 text-xs font-bold text-solana-green flex items-center gap-2 shadow-sm">
                  <Zap className="w-4 h-4 text-solana-green" /> DeFi Track Top Prize Contender
                </div>
                <div className="px-4 py-2.5 rounded-xl bg-[#0b0e14]/80 border border-solana-purple/30 text-xs font-bold text-purple-300 flex items-center gap-2 shadow-sm">
                  <Award className="w-4 h-4 text-purple-400" /> Top 3 Overall ($1,000 Grant)
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-[#1f293d] pb-2">
            <button
              onClick={() => setActiveTab('agent')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'agent'
                  ? 'bg-solana-gradient text-black shadow-lg shadow-solana-green/20'
                  : 'bg-[#121824] text-gray-400 hover:text-white border border-[#1f293d]'
              }`}
            >
              <Bot className="w-4 h-4" /> AI Guardian Agent
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'scanner'
                  ? 'bg-solana-gradient text-black shadow-lg shadow-solana-green/20'
                  : 'bg-[#121824] text-gray-400 hover:text-white border border-[#1f293d]'
              }`}
            >
              <Shield className="w-4 h-4" /> 7-Layer Token Scanner
            </button>

            <button
              onClick={() => setActiveTab('guardrails')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'guardrails'
                  ? 'bg-solana-gradient text-black shadow-lg shadow-solana-green/20'
                  : 'bg-[#121824] text-gray-400 hover:text-white border border-[#1f293d]'
              }`}
            >
              <Sliders className="w-4 h-4" /> Spend & Risk Guardrails
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'portfolio'
                  ? 'bg-solana-gradient text-black shadow-lg shadow-solana-green/20'
                  : 'bg-[#121824] text-gray-400 hover:text-white border border-[#1f293d]'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Portfolio Risk Radar
            </button>
          </div>

          {/* Main Tab Content */}
          <div className="pt-2">
            {activeTab === 'agent' && <AgentChat policy={policy} />}
            {activeTab === 'scanner' && <TokenScanner />}
            {activeTab === 'guardrails' && (
              <GuardrailSettings policy={policy} onUpdatePolicy={handleUpdatePolicy} />
            )}
            {activeTab === 'portfolio' && <PortfolioRadar />}
          </div>
        </div>
      </main>
      <footer className="border-t border-[#1f293d] py-6 px-4 text-center text-xs text-gray-500 bg-[#0b0e14]">
        <p>
          Built for the <strong className="text-gray-300">MLH Solana Hackathon 2026</strong>. Powered by Solana Web3, Jupiter DEX Aggregator & Model Context Protocol.
        </p>
      </footer>
    </>
  );
}

export default function AppShell() {
  return (
    <WalletContextProvider>
      <AppContent />
    </WalletContextProvider>
  );
}
