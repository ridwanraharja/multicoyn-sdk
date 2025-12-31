/**
 * MultiCoin Payment SDK
 * 
 * A React SDK for integrating blockchain payment modals into your application.
 * 
 * @example
 * ```tsx
 * import { PaymentProvider, openPayment } from 'multicoyn-sdk';
 * import 'multicoyn-sdk/styles';
 * 
 * function App() {
 *   return (
 *     <PaymentProvider
 *       config={{
 *         apiKey: 'your-api-key',
 *         chain: 'ethereum',
 *         environment: 'production',
 *       }}
 *     >
 *       <button onClick={() => openPayment({
 *         amount: '100',
 *         currency: 'USDT',
 *       })}>
 *         Pay Now
 *       </button>
 *     </PaymentProvider>
 *   );
 * }
 * ```
 */

// Import styles - this will be bundled by Vite
import './styles/tailwind.css';

// Export Provider
export { PaymentProvider, usePaymentContext } from './context/PaymentContext';
export type { PaymentProviderProps } from './context/PaymentContext';

// Export Modal Component (for advanced usage)
export { PaymentModal } from './components/PaymentModal';
export type { PaymentModalProps } from './components/PaymentModal';

// Export Hooks
export { usePaymentModal } from './hooks/usePaymentModal';

// Export Types
export type {
  PaymentConfig,
  PaymentResult,
  PaymentError,
  PaymentModalOptions,
  PaymentMethod,
  PaymentMethodOption,
  PaymentModalState,
} from './types';

// Export imperative API
export { openPayment, closePayment } from './api';

