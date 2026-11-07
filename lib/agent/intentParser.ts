import { oracle, POPULAR_TOKENS } from '../solana/oracle';
import { jupiter } from '../solana/jupiter';
import { GuardrailPolicy } from '../solana/types';
import { GuardrailEngine } from './guardrails';

export interface AgentExecutionResponse {
  content: string;
  reasoningSteps: string[];
  securityReport?: any;
  actionProposal?: {
    type: 'SWAP' | 'POLICY_UPDATE' | 'REJECT';
    details: {
      inputToken: string;
      outputToken: string;
      amount: number;
      estimatedOutput: string;
      verdict: any;
    };
    txHash?: string;
    status: 'PENDING_APPROVAL' | 'EXECUTED' | 'BLOCKED';
  };
}

export class IntentParser {
  /**
   * Process natural language query from user and route to appropriate agent workflow
   */
  public async processIntent(
    input: string,
    currentPolicy: GuardrailPolicy,
    guardrails: GuardrailEngine
  ): Promise<AgentExecutionResponse> {
    const text = input.trim().toLowerCase();
    const steps: string[] = [];

    steps.push('🤖 Step 1: Parsing user natural language intent and intent entities...');

    // 1. Check for token audit/analysis intent
    if (text.includes('check') || text.includes('scan') || text.includes('analyze') || text.includes('audit')) {
      steps.push('🔍 Step 2: Extracting target token mint or symbol...');
      
      let mint = 'ScamFreezeTokenMint111111111111111111111111'; // Default test case if simulated rug
      let symbol = 'HPMOON';

      if (text.includes('bonk')) {
        mint = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263';
        symbol = 'BONK';
      } else if (text.includes('usdc')) {
        mint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
        symbol = 'USDC';
      } else if (text.includes('jup') || text.includes('jupiter')) {
        mint = 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN';
        symbol = 'JUP';
      } else {
        // Check for base58 string in input
        const match = input.match(/[1-9A-HJ-NP-za-km-z]{32,44}/);
        if (match) {
          mint = match[0];
          symbol = mint.slice(0, 4) + '...' + mint.slice(-4);
        }
      }

      steps.push(`🛡️ Step 3: Dispatching SolShield Oracle for ${symbol} (${mint.slice(0, 8)}...)...`);
      steps.push('🔬 Step 4: Deserializing raw 82-byte SPL Mint layout (Freeze Authority & Mint Authority checks)...');
      
      const report = await oracle.analyzeToken(mint);

      steps.push(`✅ Step 5: Audit complete. Verdict: ${report.verdict} (Safety Score: ${report.safetyScore}/100)`);

      return {
        content: `I've completed a full byte-level security audit for **${report.name}** (\`${report.symbol}\`).\n\n* **Safety Verdict:** \`${report.verdict}\`\n* **Safety Score:** **${report.safetyScore} / 100**\n* **Active Freeze Authority:** ${report.hasFreezeAuthority ? '🚨 **YES (DANGEROUS)**' : '✅ **No (Revoked)**'}\n* **Active Mint Authority:** ${report.hasMintAuthority ? '⚠️ **YES**' : '✅ **No (Revoked)**'}\n* **Top 10 Supply Concentration:** ${report.top10HoldersPercentage}%\n\n${report.verdict === 'CRITICAL' ? '⚠️ **WARNING:** This token contains critical rug indicators. Automated trades will be blocked by SolShield guardrails.' : 'Token has healthy parameters and satisfies your guardrail policies.'}`,
        reasoningSteps: steps,
        securityReport: report,
      };
    }

    // 2. Check for Swap / Buy intent
    if (text.includes('swap') || text.includes('buy') || text.includes('trade')) {
      steps.push('💱 Step 2: Detecting swap parameters (amount, source token, destination token)...');

      // Extract amount
      const amountMatch = text.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:sol)?/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 0.5;

      // Extract target token
      let targetMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC default
      let targetSymbol = 'USDC';

      if (text.includes('bonk')) {
        targetMint = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263';
        targetSymbol = 'BONK';
      } else if (text.includes('jup') || text.includes('jupiter')) {
        targetMint = 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN';
        targetSymbol = 'JUP';
      } else if (text.includes('scam') || text.includes('rug') || text.includes('honeypot') || text.includes('hpmoon')) {
        targetMint = 'ScamFreezeTokenMint111111111111111111111111';
        targetSymbol = 'HPMOON';
      }

      steps.push(`🛡️ Step 3: Triggering Pre-Trade Security Oracle on target ${targetSymbol}...`);
      const report = await oracle.analyzeToken(targetMint);

      steps.push(`🔒 Step 4: Evaluating user-defined guardrail policies (Limit: ${currentPolicy.maxSpendPerTradeSol} SOL, Min Score: ${currentPolicy.minSafetyScoreRequired})...`);
      const guardrailCheck = guardrails.evaluateTrade(amount, report);

      if (!guardrailCheck.passed) {
        steps.push('🚫 Step 5: Guardrail policy violations detected. Execution halted.');
        return {
          content: `🚫 **Trade Blocked by SolShield Guardrails**\n\nYour autonomous agent prevented this swap to protect your capital. The following safety policies failed:\n${guardrailCheck.reasons.map((r) => `* ❌ ${r}`).join('\n')}`,
          reasoningSteps: steps,
          securityReport: report,
          actionProposal: {
            type: 'REJECT',
            details: {
              inputToken: 'SOL',
              outputToken: targetSymbol,
              amount,
              estimatedOutput: '0',
              verdict: report.verdict,
            },
            status: 'BLOCKED',
          },
        };
      }

      steps.push('⚡ Step 5: Guardrails passed! Querying Jupiter DEX Aggregator for optimal route...');
      const quote = await jupiter.getQuote({
        inputMint: 'So11111111111111111111111111111111111111112',
        outputMint: targetMint,
        amountSol: amount,
      });

      const formattedOutput = (Number(quote.outAmount) / Math.pow(10, report.decimals)).toLocaleString(undefined, { maximumFractionDigits: 2 });
      steps.push(`✨ Step 6: Route assembled via ${quote.routePlan[0]?.swapInfo.label || 'Raydium'} (Expected: ~${formattedOutput} ${targetSymbol}).`);

      return {
        content: `✅ **Pre-Flight Security & Guardrails Passed!**\n\n* **Target:** ${report.name} (\`${targetSymbol}\`)\n* **Safety Score:** ${report.safetyScore}/100 (\`${report.verdict}\`)\n* **Input:** \`${amount} SOL\`\n* **Expected Output:** \`~${formattedOutput} ${targetSymbol}\`\n* **Route:** Jupiter Aggregator via Raydium CLMM\n\nPlease approve transaction in your wallet below to broadcast to Solana.`,
        reasoningSteps: steps,
        securityReport: report,
        actionProposal: {
          type: 'SWAP',
          details: {
            inputToken: 'SOL',
            outputToken: targetSymbol,
            amount,
            estimatedOutput: formattedOutput,
            verdict: report.verdict,
          },
          status: 'PENDING_APPROVAL',
        },
      };
    }

    // 3. Fallback general assistant response
    steps.push('💬 Step 2: Providing contextual Solana agent guidance.');
    return {
      content: `Hello! I am your **SolShield AI Autonomous Guardian**. I specialize in protecting your Solana wallet from rug pulls, honeypots, and malicious token contracts while executing intent-based DeFi swaps.\n\nHere are things you can try:\n* **Audit a Token:** *"Analyze BONK"* or *"Scan token ScamFreezeTokenMint1111..."*\n* **Safe Swap:** *"Swap 0.2 SOL to USDC"* or *"Buy 0.5 SOL of BONK"*\n* **Test Rug Protection:** *"Swap 0.5 SOL for Honeypot Moon"* (Watch the guardrail block it!)\n* **Custom Policy:** Head over to the **Guardrails tab** to adjust daily limits and freeze authority thresholds.`,
      reasoningSteps: steps,
    };
  }
}

export const intentParser = new IntentParser();
