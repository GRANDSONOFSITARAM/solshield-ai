export type SafetyVerdict = 'SAFE' | 'CAUTION' | 'DANGEROUS' | 'CRITICAL';

export interface TokenSecurityReport {
  mint: string;
  name?: string;
  symbol?: string;
  decimals: number;
  supply: string;
  isInitialized: boolean;
  
  // Byte-level authority checks
  hasMintAuthority: boolean;
  mintAuthorityPubkey: string | null;
  hasFreezeAuthority: boolean;
  freezeAuthorityPubkey: string | null;
  
  // Market & Distribution Checks
  top10HoldersPercentage: number;
  liquidityUsd: number;
  volume24hUsd: number;
  isLiquidityLocked: boolean;
  
  // Scoring & Analysis
  riskScore: number; // 0 (safest) to 100 (highest risk)
  safetyScore: number; // 100 - riskScore
  verdict: SafetyVerdict;
  riskFlags: {
    level: 'info' | 'warning' | 'critical';
    title: string;
    description: string;
  }[];
  
  rawByteInspection: {
    mintLayoutOffset: string;
    freezeAuthorityOffset: string;
    supplyBytesHex: string;
  };
}

export interface GuardrailPolicy {
  maxSpendPerTradeSol: number;
  maxDailySpendSol: number;
  currentDailySpentSol: number;
  minSafetyScoreRequired: number; // e.g. 70
  autoRejectFreezeAuthority: boolean;
  autoRejectMintAuthority: boolean;
}

export interface SwapQuoteRequest {
  inputMint: string;
  outputMint: string;
  amountSol: number;
  slippageBps?: number;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: string;
  content: string;
  reasoningSteps?: string[];
  securityReport?: TokenSecurityReport;
  actionProposal?: {
    type: 'SWAP' | 'POLICY_UPDATE' | 'REJECT';
    details: {
      inputToken: string;
      outputToken: string;
      amount: number;
      estimatedOutput: string;
      verdict: SafetyVerdict;
    };
    txHash?: string;
    status: 'PENDING_APPROVAL' | 'EXECUTED' | 'BLOCKED';
  };
}
