import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePaymentContext } from "../context/PaymentContext";
import type {
  PaymentError,
  PaymentMethodOption,
  PaymentModalOptions,
  PaymentModalState,
  PaymentResult,
} from "../types";
import { LoadingState } from "./LoadingState";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { SuccessState } from "./SuccessState";

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: PaymentModalOptions;
}

// Default payment methods
const DEFAULT_PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "wallet",
    name: "Crypto Wallet",
    icon: "👛",
    description: "Connect your wallet",
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: "💳",
    description: "Pay with card",
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: "🏦",
    description: "Direct bank transfer",
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    icon: "₿",
    description: "Pay with crypto",
  },
];

/**
 * PaymentModal - Modal component rendered via React Portal
 * Supports multiple states: selection -> loading -> success
 * Uses Tailwind CSS with mc: prefix for safe scoping
 */
export function PaymentModal({ isOpen, onClose, options }: PaymentModalProps) {
  const { environment, onPaymentComplete, onPaymentError } =
    usePaymentContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Modal state management
  const [state, setState] = useState<PaymentModalState>("selection");
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodOption | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(
    null
  );

  // Get available payment methods
  const paymentMethods = options.paymentMethods || DEFAULT_PAYMENT_METHODS;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setState("selection");
      setSelectedMethod(null);
      setPaymentResult(null);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Handle backdrop click (only allow closing in selection state)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current && state === "selection") {
      onClose();
    }
  };

  // Handle payment method selection
  const handleMethodSelect = (method: PaymentMethodOption) => {
    setSelectedMethod(method);
  };

  // Handle continue payment button
  const handleContinuePayment = async () => {
    if (!selectedMethod) return;

    // Move to loading state
    setState("loading");

    try {
      // Simulate payment processing
      // TODO: Replace with actual payment API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock transaction hash
      const result: PaymentResult = {
        amount: options.amount,
        currency: options.currency,
        status: "success",
        transactionHash: "0x" + Math.random().toString(16).substr(2, 64),
        paymentMethod: selectedMethod.id,
      };

      setPaymentResult(result);
      setState("success");

      // Call callbacks after a short delay
      setTimeout(() => {
        options.onComplete?.(result);
        onPaymentComplete?.(result);
      }, 500);
    } catch (error) {
      const paymentError: PaymentError = {
        code: "PAYMENT_FAILED",
        message: error instanceof Error ? error.message : "Payment failed",
        details: error,
      };

      setState("error");
      options.onError?.(paymentError);
      onPaymentError?.(paymentError);
    }
  };

  // Handle close from success state
  const handleSuccessClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  // Render content based on state
  const renderContent = () => {
    switch (state) {
      case "selection":
        return (
          <>
            <PaymentMethodSelector
              methods={paymentMethods}
              selectedMethod={selectedMethod}
              onSelect={handleMethodSelect}
              amount={options.amount}
              currency={options.currency}
            />
            <button
              onClick={handleContinuePayment}
              disabled={!selectedMethod}
              className="mc:w-full mc:bg-blue-600 hover:mc:bg-blue-700 disabled:mc:bg-gray-300 disabled:mc:cursor-not-allowed mc:text-white mc:font-semibold mc:py-3 mc:px-4 mc:rounded-lg mc:transition-colors mc:duration-200 mc:mt-4"
            >
              Continue Payment
            </button>
          </>
        );

      case "loading":
        return <LoadingState message="Processing your payment..." />;

      case "success":
        return paymentResult ? (
          <SuccessState result={paymentResult} onClose={handleSuccessClose} />
        ) : null;

      case "error":
        return (
          <div className="mc:flex mc:flex-col mc:items-center mc:justify-center mc:py-8 mc:space-y-4">
            <div className="mc:w-16 mc:h-16 mc:bg-red-100 mc:rounded-full mc:flex mc:items-center mc:justify-center">
              <svg
                className="mc:w-10 mc:h-10 mc:text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="mc:text-center">
              <h3 className="mc:text-2xl mc:font-bold mc:text-gray-900 mc:mb-2">
                Payment Failed
              </h3>
              <p className="mc:text-gray-600">
                There was an error processing your payment
              </p>
            </div>
            <button
              onClick={onClose}
              className="mc:w-full mc:bg-gray-600 hover:mc:bg-gray-700 mc:text-white mc:font-semibold mc:py-3 mc:px-4 mc:rounded-lg mc:transition-colors mc:duration-200"
            >
              Close
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const modalContent = (
    <div
      ref={backdropRef}
      className="mc:fixed mc:inset-0 mc:z-[9999] mc:flex mc:items-center mc:justify-center mc:bg-black mc:bg-opacity-50 mc:backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div
        ref={modalRef}
        className={`mc:relative mc:bg-white mc:rounded-lg mc:shadow-xl mc:max-w-md mc:w-full mc:mx-4 mc:p-6 mc:transition-all mc:duration-300 ${
          state === "selection" ? "mc:animate-in mc:fade-in mc:zoom-in-95" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - only show in selection state */}
        {state === "selection" && (
          <button
            onClick={onClose}
            className="mc:absolute mc:top-4 mc:right-4 mc:text-gray-400 hover:mc:text-gray-600 mc:transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="mc:w-6 mc:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Modal content */}
        <div className="mc:space-y-4">
          {renderContent()}

          {/* Environment badge - only show in selection state */}
          {state === "selection" &&
            environment &&
            environment !== "production" && (
              <div className="mc:text-center">
                <span className="mc:inline-block mc:bg-yellow-100 mc:text-yellow-800 mc:text-xs mc:font-semibold mc:px-2 mc:py-1 mc:rounded">
                  {environment.toUpperCase()}
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );

  // Render to document.body using Portal
  return createPortal(modalContent, document.body);
}
