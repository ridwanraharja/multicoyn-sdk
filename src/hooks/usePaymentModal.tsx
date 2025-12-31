import { useCallback, useState } from "react";
import { PaymentModal } from "../components/PaymentModal";
import type { PaymentModalOptions } from "../types";

/**
 * Hook to manage payment modal state
 * Returns modal component and functions to open/close
 */
export function usePaymentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<PaymentModalOptions | null>(null);

  const open = useCallback((paymentOptions: PaymentModalOptions) => {
    setOptions(paymentOptions);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Clear options after animation (optional)
    setTimeout(() => setOptions(null), 300);
  }, []);

  const Modal = options ? (
    <PaymentModal isOpen={isOpen} onClose={close} options={options} />
  ) : null;

  return {
    open,
    close,
    isOpen,
    Modal,
  };
}
