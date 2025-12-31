import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { PaymentModal } from "../components/PaymentModal";
import type { PaymentConfig, PaymentModalOptions } from "../types";

interface PaymentContextValue extends PaymentConfig {
  isOpen: boolean;
  openModal: (options: PaymentModalOptions) => void;
  closeModal: () => void;
  currentOptions: PaymentModalOptions | null;
}

const PaymentContext = createContext<PaymentContextValue | undefined>(
  undefined
);

export interface PaymentProviderProps {
  children: ReactNode;
  config: PaymentConfig;
}

/**
 * PaymentProvider - Provides global configuration for the Payment SDK
 *
 * @example
 * ```tsx
 * import { PaymentProvider } from 'multicoyn-sdk';
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
 *       <YourApp />
 *     </PaymentProvider>
 *   );
 * }
 * ```
 */
export function PaymentProvider({ children, config }: PaymentProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentOptions, setCurrentOptions] =
    useState<PaymentModalOptions | null>(null);

  const openModal = useCallback((options: PaymentModalOptions) => {
    setCurrentOptions(options);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Clear options after a delay to allow animation
    setTimeout(() => setCurrentOptions(null), 300);
  }, []);

  const value: PaymentContextValue = {
    ...config,
    isOpen,
    openModal,
    closeModal,
    currentOptions,
  };

  // Register with global modal manager for imperative API
  if (typeof window !== "undefined") {
    (window as any).__MULTICOYN_PAYMENT_CONTEXT__ = value;
  }

  return (
    <PaymentContext.Provider value={value}>
      {children}
      {currentOptions && (
        <PaymentModal
          isOpen={isOpen}
          onClose={closeModal}
          options={currentOptions}
        />
      )}
    </PaymentContext.Provider>
  );
}

/**
 * Hook to access payment context
 * @throws Error if used outside PaymentProvider
 */
export function usePaymentContext(): PaymentContextValue {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePaymentContext must be used within a PaymentProvider");
  }
  return context;
}
