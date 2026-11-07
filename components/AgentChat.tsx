'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Send, Bot, User, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { AgentChatMessage, GuardrailPolicy } from '../lib/solana/types';
import { intentParser } from '../lib/agent/intentParser';
import { guardrailEngine } from '../lib/agent/guardrails';

interface AgentChatProps {
  policy: GuardrailPolicy;
}

export const AgentChat: React.FC<AgentChatProps> = ({ policy }) => {
  const { connected, publicKey } = useWallet();
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: `Hello! I am **SolShield AI**, your autonomous on-chain DeFi Guardian for Solana.\n\nI monitor and protect your trades at the raw bytecode level, preventing rug pulls, freeze authorities, and uncontrolled agent spending.\n\nTry asking me:\n* *"Analyze BONK token"* (Safe SPL token audit)\n* *"Swap 0.2 SOL to USDC"* (Safe intent-based swap proposal)\n* *"Swap 0.5 SOL to Honeypot Moon"* (Watch me detect and block an active freeze authority rug!)`,
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input.trim();
    if (!promptToSend || thinking) return;

    const userMsg: AgentChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: promptToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setThinking(true);

    try {
      const response = await intentParser.processIntent(promptToSend, policy, guardrailEngine);
      
      const agentMsg: AgentChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: response.content,
        reasoningSteps: response.reasoningSteps,
        securityReport: response.securityReport,
        actionProposal: response.actionProposal,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'system',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: 'An error occurred while executing the agent workflow.',
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleApproveProposal = (msgId: string, amount: number) => {
    guardrailEngine.recordSpend(amount);
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId && m.actionProposal) {
          return {
            ...m,
            actionProposal: {
              ...m.actionProposal,
              status: 'EXECUTED',
              txHash: `4HkWs8Z1JpL...${Math.random().toString(36).substring(2, 8)}`,
            },
          };
        }
        return m;
      })
    );
  };

  return (
    <div className="bg-[#121824] border border-[#1f293d] rounded-2xl h-[680px] flex flex-col shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-[#1f293d] flex items-center justify-between bg-[#0b0e14]/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-solana-gradient p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0b0e14] rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-solana-green" />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Autonomous Agent Console
              <span className="w-2 h-2 rounded-full bg-solana-green animate-ping" />
            </h2>
            <p className="text-[11px] text-gray-400">
              Active Protection: Freeze Authority Veto & Spend Guardrails Active
            </p>
          </div>
        </div>

        {/* Suggested Prompts Pills */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => handleSend('Analyze BONK token')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1f293d] hover:bg-[#283750] text-gray-300 font-mono transition flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" /> Audit BONK
          </button>
          <button
            onClick={() => handleSend('Swap 0.2 SOL to USDC')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1f293d] hover:bg-[#283750] text-emerald-300 font-mono transition flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" /> Safe Swap
          </button>
          <button
            onClick={() => handleSend('Swap 0.5 SOL for Honeypot Moon')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-800/60 hover:bg-red-950/70 text-red-300 font-mono transition flex items-center gap-1"
          >
            <ShieldAlert className="w-3 h-3 text-red-400" /> Test Rug Block
          </button>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender !== 'user' && (
              <div className="w-8 h-8 rounded-lg bg-[#1f293d] flex items-center justify-center shrink-0 text-solana-green">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-solana-purple/20 border border-solana-purple/40 text-gray-100 rounded-br-none'
                  : 'bg-[#0b0e14] border border-[#1f293d] text-gray-200 rounded-bl-none'
              }`}
            >
              {/* Reasoning Steps (Chain-of-thought) */}
              {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                <div className="p-3 bg-[#121824] rounded-xl border border-[#1f293d] font-mono text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                    <Terminal className="w-3.5 h-3.5" /> Agent Execution Trace:
                  </div>
                  {msg.reasoningSteps.map((step, idx) => (
                    <div key={idx} className="text-gray-400 pl-2 border-l border-gray-700">
                      {step}
                    </div>
                  ))}
                </div>
              )}

              {/* Message text */}
              <div className="whitespace-pre-line leading-relaxed font-sans">{msg.content}</div>

              {/* Proposal Action Card (e.g. Swap proposal or Block notice) */}
              {msg.actionProposal && (
                <div className="mt-3 p-3.5 rounded-xl bg-[#121824] border border-[#1f293d] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-gray-300">
                      Intent Proposal: {msg.actionProposal.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        msg.actionProposal.status === 'EXECUTED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : msg.actionProposal.status === 'BLOCKED'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-cyan-500/20 text-cyan-400'
                      }`}
                    >
                      {msg.actionProposal.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0b0e14] font-mono">
                    <span className="text-gray-300">
                      {msg.actionProposal.details.amount} {msg.actionProposal.details.inputToken}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <span className="text-solana-green font-bold">
                      ~{msg.actionProposal.details.estimatedOutput} {msg.actionProposal.details.outputToken}
                    </span>
                  </div>

                  {msg.actionProposal.status === 'PENDING_APPROVAL' && (
                    <button
                      onClick={() =>
                        handleApproveProposal(msg.id, msg.actionProposal!.details.amount)
                      }
                      className="w-full py-2 rounded-lg bg-solana-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-95 transition"
                    >
                      <CheckCircle2 className="w-4 h-4 text-black" /> Approve & Broadcast to Solana
                    </button>
                  )}

                  {msg.actionProposal.status === 'EXECUTED' && (
                    <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed on Solana! Tx: {msg.actionProposal.txHash}
                    </div>
                  )}

                  {msg.actionProposal.status === 'BLOCKED' && (
                    <div className="text-[11px] text-red-400 font-mono flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Protection Triggered: Capital Saved.
                    </div>
                  )}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-solana-purple/30 border border-solana-purple/50 flex items-center justify-center shrink-0 text-white">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {thinking && (
          <div className="flex gap-3 items-center text-xs text-gray-400">
            <div className="w-8 h-8 rounded-lg bg-[#1f293d] flex items-center justify-center shrink-0 text-solana-green">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <span className="font-mono animate-pulse">
              SolShield agent analyzing SPL byte layouts & routing Jupiter quotes...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-[#1f293d] bg-[#0b0e14]/90 flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask SolShield (e.g. 'Swap 0.3 SOL to USDC', 'Audit BONK', 'Test rug protection')..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={thinking}
          className="flex-1 bg-[#121824] border border-[#1f293d] rounded-xl px-4 py-2.5 text-xs text-white focus:border-solana-green outline-none"
        />
        <button
          type="submit"
          disabled={thinking || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-solana-gradient text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 disabled:opacity-40 transition flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5 text-black" />
        </button>
      </form>
    </div>
  );
};
