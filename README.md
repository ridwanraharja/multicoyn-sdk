# Multicoyn SDK

React SDK for multi-coin/multi-token payments with split allocation, auto-optimize, and multi-chain support (Lisk Sepolia). Includes a ready-to-use payment modal UI and wallet integration via RainbowKit/Wagmi.

## Installation

```bash
npm install multicoyn-sdk
# or
yarn add multicoyn-sdk
# or
pnpm add multicoyn-sdk
```

### Peer Dependencies
Make sure these are installed:
```bash
npm install react react-dom wagmi viem @tanstack/react-query @rainbow-me/rainbowkit
```

## Quick Start

```tsx
import { Web3Provider, PaymentProvider, MulticoynButton } from 'multicoyn-sdk';
import 'multicoyn-sdk/styles';

const items = [{ name: 'Order #123', price: 100 }]; // price in selected currency (default USD)

function App() {
  return (
    <Web3Provider>
      <PaymentProvider>
        <MulticoynButton
          merchantAddress="0xYourMerchantAddress"
          items={items}
          config={{ currency: 'USD' }} // or 'IDR'
          onPaymentComplete={(result) => console.log('Success:', result)}
          onPaymentError={(error) => console.error('Error:', error)}
        />
      </PaymentProvider>
    </Web3Provider>
  );
}
```

## Key Features

- 🪙 **Multi-token split**: Users can allocate multiple tokens at once (ETH, USDC, USDT, DAI, WBTC)
- ⚖️ **Auto-optimize**: Automatically distributes allocation (prioritizes stablecoins if sufficient)
- 🔄 **Live price fetch**: Real-time token prices via on-chain TokenRegistry
- 🛡️ **Balance & price validation**: Verifies allocation covers total payment before submission
- 🧾 **Multi-item cart**: Supports multiple items with automatic total calculation
- 💱 **Multi-currency**: Supports USD and IDR pricing with automatic conversion
- 💸 **IDR Settlement**: Option to settle payments in IDRX stablecoin
- 🌐 **Wallet-ready**: RainbowKit + Wagmi + React Query pre-configured via `Web3Provider`

## Supported Tokens

| Token | Symbol | Use |
|-------|--------|-----|
| Ether | ETH | Payment |
| USD Coin | USDC | Payment |
| Tether USD | USDT | Payment |
| Dai Stablecoin | DAI | Payment |
| Wrapped Bitcoin | WBTC | Payment |
| Indonesian Rupiah | IDRX | Settlement only |

## Components & API

### `<MulticoynButton />`

Main button component that opens the payment modal.

```ts
interface MulticoynButtonProps {
  merchantAddress: `0x${string}`;      // Merchant wallet address
  items: PaymentItem[];                 // Cart items
  config?: PaymentConfig;               // Payment configuration
  onPaymentComplete?: (result: PaymentResult) => void;
  onPaymentError?: (error: Error) => void;
  className?: string;                   // Custom button styling
  children?: React.ReactNode;           // Custom button content
}

interface PaymentItem {
  name: string;
  price: number;  // Price in selected currency
}

interface PaymentConfig {
  currency?: 'USD' | 'IDR';             // Default: 'USD'
  target?: `0x${string}`;               // Optional: target contract for callback
  callData?: `0x${string}`;             // Optional: calldata for router callback
}
```

#### Payment Result

```ts
interface PaymentResult {
  success: boolean;
  transactionId?: string;               // Transaction hash
  tokens: Token[];                      // Tokens used in payment
}

interface Token {
  id: string;
  name: string;
  symbol: string;
  amount: number;                       // User's balance
  chain: string;
  percentage: number;                   // Allocation percentage (0-100)
  address: `0x${string}`;
  decimals: number;
  priceUSD: number;
}
```

### Providers

#### `<Web3Provider>`
Wraps your app with Wagmi, RainbowKit, and React Query providers.

```tsx
<Web3Provider>
  {/* Your app */}
</Web3Provider>
```

#### `<PaymentProvider>`
Optional provider for global payment configuration.

```tsx
interface PaymentConfig {
  merchantAddress?: `0x${string}`;
  settleInIDR?: boolean;
  enabledTokens?: string[];
  theme?: 'light' | 'dark';
}

<PaymentProvider initialConfig={{ theme: 'dark' }}>
  {/* Your app */}
</PaymentProvider>
```

#### `usePaymentConfig()`
Hook to access and update payment configuration at runtime.

```tsx
const { config, updateConfig } = usePaymentConfig();
updateConfig({ settleInIDR: true });
```

### Hooks

Available hooks for advanced usage:

| Hook | Description |
|------|-------------|
| `usePaymentModal` | Control payment modal state |
| `usePaymentRouter` | Execute payments & check transaction status |
| `useTokenRegistry` | Fetch token prices from on-chain registry |
| `useMultiTokenBalances` | Get user balances for all supported tokens |
| `useMultiTokenPrices` | Get current prices for all supported tokens |
| `useERC20` | Generic ERC20 token operations |

#### Example: usePaymentRouter

```tsx
const { 
  executePayment,    // Execute payment transaction
  hash,              // Transaction hash
  isPending,         // Transaction pending
  isConfirming,      // Waiting for confirmation
  isConfirmed,       // Transaction confirmed
  error              // Error if any
} = usePaymentRouter();
```

### Configuration & Constants

```ts
import { 
  CONTRACTS,           // Contract addresses
  TOKENS,              // Token addresses
  wagmiConfig,         // Wagmi configuration
  liskSepolia,         // Chain config
  FEE_PERCENTAGE,      // 0.003 (0.3%)
  USD_SCALE,           // 1e8
  TOKEN_METADATA       // Token info (symbol, decimals, name)
} from 'multicoyn-sdk';
```

#### Contract Addresses (Lisk Sepolia)

```ts
CONTRACTS = {
  PAYMENT_ROUTER: "0x73Dbc7447E3B097cFc8b08ee7896a9D27D67e2B4",
  TOKEN_REGISTRY: "0x1d2C6dfB2f127d6F3c14859c9E54cbc27bd7FcCE"
}

TOKENS = {
  NATIVE: "0x0000000000000000000000000000000000000000",  // ETH
  USDC: "0x0Ff0aED4862e168086FD8BC38a4c27cE1830228b",
  USDT: "0xBc63b0cf19b757c2a6Ef646027f8CeA7Af2c3e7F",
  DAI: "0xd2aAa24D5C305B7968e955A89F0bf4E7776E7078",
  WBTC: "0x1BEC7ec7F995B9bcd93F411B2cE7d289C6b05f03",
  IDRX: "0x39B9205cDC53114c0B0F22F04C1215A13197b4d9"   // Settlement
}
```

## Styling

Import the styles once in your app:

```tsx
import 'multicoyn-sdk/styles';
// or
import 'multicoyn-sdk/dist/multicoyn-sdk.css';
```

- No Tailwind setup required in host app (CSS is bundled)
- All classes are prefixed with `mc:` to prevent conflicts

## Payment Flow

1. User clicks the MulticoynButton
2. If not connected, wallet connection is triggered
3. Payment modal opens showing user's token balances
4. User allocates tokens (manually or via auto-optimize)
5. Total allocation must equal 100%
6. User submits payment
7. SDK handles token approvals automatically
8. Payment is executed via PaymentRouter contract
9. Transaction confirmation triggers `onPaymentComplete` callback

## Validation Rules

- ✅ Total token allocation must equal 100%
- ✅ Token prices must be available from registry
- ✅ User must have sufficient balance for selected allocation
- ❌ Button disabled if any validation fails

## Fees

- Platform fee: **0.3%** (automatically added to payment)
- Fee is calculated on top of the product price

## Build & Development

```bash
npm run dev        # Start development server
npm run build      # Build library (dist/)
npm run build:lib  # Build with type declarations
npm run lint       # Run ESLint
```

## Requirements

- Node.js 20.19+ (Vite 7)
- React 18 or 19

## Network

Currently deployed on **Lisk Sepolia** testnet.

## License

MIT
