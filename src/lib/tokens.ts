import { formatUnits, parseUnits } from 'viem';
import { USD_SCALE } from '../constants/payment';
import type { Token } from '../components/types';

export function calculateTokenAmount(
  usdValue: number,
  priceUSD: number,
  decimals: number
): bigint {
  const tokenAmount = usdValue / priceUSD;
  return parseUnits(tokenAmount.toFixed(decimals), decimals);
}

export function calculateUSDValue(
  tokenAmount: bigint,
  priceUSD: number,
  decimals: number
): number {
  const amount = parseFloat(formatUnits(tokenAmount, decimals));
  return amount * priceUSD;
}

export function formatTokenAmount(amount: bigint, decimals: number): string {
  return formatUnits(amount, decimals);
}

export function validateTokenSelection(tokens: Token[]): {
  isValid: boolean;
  error?: string;
} {
  const activeTokens = tokens.filter((t) => t.percentage > 0);

  if (activeTokens.length === 0) {
    return { isValid: false, error: 'No tokens selected' };
  }

  if (activeTokens.length > 5) {
    return { isValid: false, error: 'Maximum 5 tokens allowed' };
  }

  const totalPercentage = tokens.reduce((sum, t) => sum + t.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    return { isValid: false, error: 'Total must equal 100%' };
  }

  // Check sufficient balances
  for (const token of activeTokens) {
    if (token.amount === 0) {
      return { isValid: false, error: `Insufficient ${token.symbol} balance` };
    }
  }

  return { isValid: true };
}

export function scaleUSDAmount(usdAmount: number): bigint {
  return BigInt(Math.floor(usdAmount * USD_SCALE));
}
