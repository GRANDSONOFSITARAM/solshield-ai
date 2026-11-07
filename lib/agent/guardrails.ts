import { GuardrailPolicy, TokenSecurityReport } from '../solana/types';

export const DEFAULT_GUARDRAILS: GuardrailPolicy = {
  maxSpendPerTradeSol: 1.0,
  maxDailySpendSol: 5.0,
  currentDailySpentSol: 0.25,
  minSafetyScoreRequired: 75,
  autoRejectFreezeAuthority: true,
  autoRejectMintAuthority: true,
};

export interface GuardrailCheckResult {
  passed: boolean;
  reasons: string[];
}

export class GuardrailEngine {
  private policy: GuardrailPolicy;

  constructor(initialPolicy: GuardrailPolicy = DEFAULT_GUARDRAILS) {
    this.policy = { ...initialPolicy };
  }

  public getPolicy(): GuardrailPolicy {
    return { ...this.policy };
  }

  public updatePolicy(updates: Partial<GuardrailPolicy>): GuardrailPolicy {
    this.policy = { ...this.policy, ...updates };
    return this.getPolicy();
  }

  public recordSpend(amountSol: number) {
    this.policy.currentDailySpentSol += amountSol;
  }

  /**
   * Validate a proposed trade against user-defined guardrail policies
   */
  public evaluateTrade(amountSol: number, report: TokenSecurityReport): GuardrailCheckResult {
    const reasons: string[] = [];

    // 1. Max spend per trade check
    if (amountSol > this.policy.maxSpendPerTradeSol) {
      reasons.push(
        `Amount (${amountSol} SOL) exceeds your maximum per-trade limit (${this.policy.maxSpendPerTradeSol} SOL).`
      );
    }

    // 2. Daily budget cap check
    if (this.policy.currentDailySpentSol + amountSol > this.policy.maxDailySpendSol) {
      reasons.push(
        `Trade would exceed your daily spend allowance (${this.policy.maxDailySpendSol} SOL). Currently spent: ${this.policy.currentDailySpentSol.toFixed(2)} SOL.`
      );
    }

    // 3. Minimum safety score threshold
    if (report.safetyScore < this.policy.minSafetyScoreRequired) {
      reasons.push(
        `Token safety score (${report.safetyScore}/100) is below your policy threshold (${this.policy.minSafetyScoreRequired}/100). Verdict: ${report.verdict}.`
      );
    }

    // 4. Freeze authority policy
    if (this.policy.autoRejectFreezeAuthority && report.hasFreezeAuthority) {
      reasons.push(
        `Policy violation: Token has active Freeze Authority. The creator can freeze your wallet.`
      );
    }

    // 5. Mint authority policy
    if (this.policy.autoRejectMintAuthority && report.hasMintAuthority) {
      reasons.push(
        `Policy violation: Token has active Mint Authority. Creator can arbitrarily inflate supply.`
      );
    }

    return {
      passed: reasons.length === 0,
      reasons,
    };
  }
}

export const guardrailEngine = new GuardrailEngine();
