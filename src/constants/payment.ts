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
  ETH: {
    symbol: 'ETH',
    decimals: 18,
    name: 'Ether',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg'
  },
  USDC: {
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg'
  },
  USDT: {
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.svg'
  },
  DAI: {
    symbol: 'DAI',
    decimals: 18,
    name: 'Dai Stablecoin',
    logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg'
  },
  WBTC: {
    symbol: 'WBTC',
    decimals: 8,
    name: 'Wrapped Bitcoin',
    logo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg'
  },
  IDRX: {
    symbol: 'IDRX',
    decimals: 18,
    name: 'Indonesian Rupiah',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
  },
} as const;
