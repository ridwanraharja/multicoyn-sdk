// Payment Router constants
export const FEE_BASIS_POINTS = 30; // 0.3%
export const FEE_PERCENTAGE = 0.003; // 0.3%
export const MAX_TOKENS_PER_PAYMENT = 5;
export const USD_DECIMALS = 8; // 1e8 scaling
export const USD_SCALE = 10 ** USD_DECIMALS;

// Approval amount (max uint256 for infinite approval)
export const MAX_UINT256 = BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
);

// Token metadata
export const TOKEN_METADATA = {
  ETH: { symbol: 'ETH', decimals: 18, name: 'Ether' },
  USDC: { symbol: 'USDC', decimals: 6, name: 'USD Coin' },
  USDT: { symbol: 'USDT', decimals: 6, name: 'Tether USD' },
  DAI: { symbol: 'DAI', decimals: 18, name: 'Dai Stablecoin' },
  WBTC: { symbol: 'WBTC', decimals: 8, name: 'Wrapped Bitcoin' },
  IDRX: { symbol: 'IDRX', decimals: 18, name: 'Indonesian Rupiah' },
} as const;
