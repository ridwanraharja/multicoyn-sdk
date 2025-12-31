# MultiCoyn SDK

A React SDK for integrating blockchain payment modals into your application.

## Features

- 🎨 **Styled Components** - Pre-styled modal with scoped CSS (no conflicts)
- ⚡ **Imperative API** - Simple `openPayment()` function
- 🔧 **Configurable** - Global configuration via Provider
- 📱 **Responsive** - Mobile-friendly design
- 🎯 **TypeScript** - Full type support
- 🔒 **Isolated** - CSS prefixed with `mc:` to prevent conflicts

## Installation

```bash
npm install multicoyn-sdk
# or
yarn add multicoyn-sdk
# or
pnpm add multicoyn-sdk
```

## Quick Start

```tsx
import { PaymentProvider, openPayment } from 'multicoyn-sdk';
import 'multicoyn-sdk/styles';

function App() {
  return (
    <PaymentProvider
      config={{
        apiKey: 'your-api-key',
        chain: 'ethereum',
        environment: 'production',
      }}
    >
      <button onClick={() => openPayment({
        amount: '100',
        currency: 'USDT',
      })}>
        Pay Now
      </button>
    </PaymentProvider>
  );
}
```

## API Reference

### PaymentProvider

Wrap your app with `PaymentProvider` to configure the SDK globally.

```tsx
<PaymentProvider
  config={{
    apiKey: string;           // Required: Your API key
    chain: string;            // Required: Blockchain network (e.g., 'ethereum', 'polygon')
    environment?: 'production' | 'staging' | 'development';
    onPaymentComplete?: (result: PaymentResult) => void;
    onPaymentError?: (error: PaymentError) => void;
  }}
>
  {children}
</PaymentProvider>
```

### openPayment()

Open the payment modal imperatively.

```tsx
openPayment({
  amount: string;              // Required: Payment amount
  currency: string;            // Required: Currency code (e.g., 'USDT', 'ETH')
  recipient?: string;          // Optional: Recipient address
  metadata?: Record<string, unknown>;
  paymentMethods?: PaymentMethodOption[];
  onComplete?: (result: PaymentResult) => void;
  onError?: (error: PaymentError) => void;
});
```

### closePayment()

Close the payment modal programmatically.

```tsx
import { closePayment } from 'multicoyn-sdk';

closePayment();
```

### usePaymentModal()

React hook for controlling the payment modal.

```tsx
import { usePaymentModal } from 'multicoyn-sdk';

function PayButton() {
  const { open, close, isOpen } = usePaymentModal();

  return (
    <button onClick={() => open({ amount: '50', currency: 'USDT' })}>
      {isOpen ? 'Processing...' : 'Pay $50'}
    </button>
  );
}
```

## Types

```typescript
interface PaymentResult {
  transactionHash?: string;
  amount: string;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  paymentMethod?: string;
}

interface PaymentError {
  code: string;
  message: string;
  details?: unknown;
}

interface PaymentMethodOption {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  disabled?: boolean;
}
```

## Styling

The SDK uses Tailwind CSS with a `mc:` prefix to prevent conflicts with your application's styles. Import the styles once in your app:

```tsx
import 'multicoyn-sdk/styles';
```

## Requirements

- React 18.0+ or React 19.0+
- React DOM 18.0+ or 19.0+

## License

MIT
