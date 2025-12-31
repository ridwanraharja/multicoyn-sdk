import type { PaymentModalOptions } from "../types";

/**
 * Open payment modal imperatively
 *
 * This function works by accessing the PaymentContext from the PaymentProvider.
 * Make sure PaymentProvider is mounted in your component tree.
 *
 * @example
 * ```tsx
 * import { PaymentProvider, openPayment } from 'multicoyn-sdk';
 *
 * function App() {
 *   return (
 *     <PaymentProvider config={{ apiKey: '...', chain: 'ethereum' }}>
 *       <button onClick={() => openPayment({
 *         amount: '100',
 *         currency: 'USDT',
 *         recipient: '0x...',
 *       })}>
 *         Pay Now
 *       </button>
 *     </PaymentProvider>
 *   );
 * }
 * ```
 *
 * @throws Error if PaymentProvider is not found in component tree
 */
export function openPayment(options: PaymentModalOptions): void {
  if (typeof window === "undefined") {
    throw new Error("openPayment can only be called in browser environment");
  }

  // Access the context from the global window object
  // This is set by PaymentProvider
  const context = (window as any).__MULTICOYN_PAYMENT_CONTEXT__;

  if (!context) {
    throw new Error(
      "PaymentProvider not found. Please wrap your app with <PaymentProvider> before calling openPayment()."
    );
  }

  if (typeof context.openModal !== "function") {
    throw new Error("PaymentProvider is not properly initialized");
  }

  context.openModal(options);
}

/**
 * Close payment modal imperatively
 *
 * @throws Error if PaymentProvider is not found in component tree
 */
export function closePayment(): void {
  if (typeof window === "undefined") {
    throw new Error("closePayment can only be called in browser environment");
  }

  const context = (window as any).__MULTICOYN_PAYMENT_CONTEXT__;

  if (!context) {
    throw new Error(
      "PaymentProvider not found. Please wrap your app with <PaymentProvider> before calling closePayment()."
    );
  }

  if (typeof context.closeModal !== "function") {
    throw new Error("PaymentProvider is not properly initialized");
  }

  context.closeModal();
}
