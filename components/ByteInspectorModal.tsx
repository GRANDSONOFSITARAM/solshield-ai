'use client';

import React from 'react';
import { X, Binary, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { TokenSecurityReport } from '../lib/solana/types';

interface ByteInspectorModalProps {
  report: TokenSecurityReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ByteInspectorModal: React.FC<ByteInspectorModalProps> = ({ report, isOpen, onClose }) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121824] border border-[#1f293d] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">
              Raw SPL Mint Byte Deserializer
            </h3>
            <p className="text-xs text-gray-400">
              Direct byte-offset parsing of the 82-byte on-chain Token Mint account
            </p>
          </div>
        </div>

        {/* Binary Layout Table */}
        <div className="space-y-3 font-mono text-xs">
          {/* Mint Authority */}
          <div className="p-3 bg-[#0b0e14] rounded-xl border border-[#1f293d]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-cyan-400 font-semibold">[Bytes 0–35] Mint Authority Layout</span>
              {report.hasMintAuthority ? (
                <span className="flex items-center gap-1 text-red-400 font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" /> Option=1 (Active)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Option=0 (Revoked)
                </span>
              )}
            </div>
            <p className="text-gray-400 text-[11px] break-all">
              {report.rawByteInspection.mintLayoutOffset}
            </p>
          </div>

          {/* Supply & Decimals */}
          <div className="p-3 bg-[#0b0e14] rounded-xl border border-[#1f293d]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-cyan-400 font-semibold">[Bytes 36–45] Supply & Decimals</span>
              <span className="text-gray-300">Decimals: {report.decimals}</span>
            </div>
            <p className="text-gray-400 text-[11px]">
              Hex bytes: <code className="text-yellow-400">{report.rawByteInspection.supplyBytesHex}</code> (Raw Supply: {report.supply})
            </p>
          </div>

          {/* Freeze Authority */}
          <div className="p-3 bg-[#0b0e14] rounded-xl border border-[#1f293d]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-cyan-400 font-semibold">[Bytes 46–81] Freeze Authority Layout</span>
              {report.hasFreezeAuthority ? (
                <span className="flex items-center gap-1 text-red-400 font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" /> Option=1 (Active Freeze!)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Option=0 (Revoked)
                </span>
              )}
            </div>
            <p className="text-gray-400 text-[11px] break-all">
              {report.rawByteInspection.freezeAuthorityOffset}
            </p>
          </div>
        </div>

        <div className="mt-5 p-3 rounded-xl bg-solana-purple/10 border border-solana-purple/30 text-xs text-purple-200">
          💡 <strong>Architectural Note:</strong> Unlike metadata APIs, this check reads raw Solana account data directly. A scam token can fake its logo and website, but it cannot disguise byte 46 (Freeze Authority) on Solana consensus.
        </div>
      </div>
    </div>
  );
};
