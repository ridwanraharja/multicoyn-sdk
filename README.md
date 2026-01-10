# Multicoyn SDK

A Web3 payment SDK for multichain crypto payments with support for multiple tokens and settlement options.

## Installation

```bash
npm install multicoyn-sdk
# or
yarn add multicoyn-sdk
# or
pnpm add multicoyn-sdk
```

## Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
npm install react react-dom viem wagmi @tanstack/react-query @rainbow-me/rainbowkit
```

## Usage

### 1. Setup Providers

Wrap your app with the required providers:

```tsx
import { Web3Provider, PaymentProvider } from 'multicoyn-sdk';
import 'multicoyn-sdk/styles';

function App() {
  return (
    <Web3Provider>
      <PaymentProvider>
        <YourApp />
      </PaymentProvider>
    </Web3Provider>
  );
}
```

### 2. Use the Payment Button

```tsx
import { MulticoynButton } from 'multicoyn-sdk';

function YourComponent() {
  return (
    <MulticoynButton
      amount="100"
      currency="USD"
      recipientAddress="0x..."
      onSuccess={(txHash) => console.log('Payment success:', txHash)}
      onError={(error) => console.error('Payment error:', error)}
    />
  );
}
```

### 3. Access Payment Configuration

```tsx
import { usePaymentConfig } from 'multicoyn-sdk';

function YourComponent() {
  const config = usePaymentConfig();
  // Access payment configuration and state
}
```

## Features

- Multi-chain payment support
- Multiple token options (USDC, USDT, DAI, WBTC, Native tokens)
- Settlement token support (IDRX)
- Built-in wallet connection via RainbowKit
- TypeScript support
- Tailwind CSS styling

## Configuration

The SDK comes with pre-configured contracts and chains. You can also access these configurations:

```tsx
import { CONTRACTS, TOKENS, liskSepolia } from 'multicoyn-sdk';

console.log(CONTRACTS.PAYMENT_ROUTER);
console.log(TOKENS.USDC);
```

## License

MIT
