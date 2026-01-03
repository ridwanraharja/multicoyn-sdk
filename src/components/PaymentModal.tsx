import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePaymentContext } from "../context/PaymentContext";
import type {
  PaymentError,
  PaymentMethodOption,
  PaymentModalOptions,
  PaymentModalState,
  PaymentResult,
  PaymentTokenOption,
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
  const [tokenAllocations, setTokenAllocations] = useState<
    Record<string, number>
  >({});

  // Get available payment methods
  const paymentMethods = options.paymentMethods || DEFAULT_PAYMENT_METHODS;
  const paymentTokens: PaymentTokenOption[] = options.paymentTokens || [];

  // Compute total USD of selected tokens (if price available)
  const totalSelectedUSD = paymentTokens.reduce((acc, token) => {
    const amt = tokenAllocations[token.id] ?? 0;
    if (!token.priceUSD) return acc;
    return acc + amt * token.priceUSD;
  }, 0);

  const requiredTotal = Number(options.amount) || 0;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setState("selection");
      // Default to wallet if tokens are provided, otherwise no selection
      if (paymentTokens.length > 0) {
        setSelectedMethod({
          id: "wallet",
          name: "Crypto Wallet",
          icon: "👛",
          description: "Use your tokens",
        });
      } else {
        setSelectedMethod(null);
      }
      setPaymentResult(null);
      setTokenAllocations({});
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

  const handleUpdateTokenAllocation = (tokenId: string, amount: number) => {
    setTokenAllocations((prev) => {
      const next = { ...prev, [tokenId]: Math.max(amount, 0) };
      return next;
    });
  };

  // Handle continue payment button
  const handleContinuePayment = async () => {
    if (!selectedMethod) return;

    // Move to loading state
    setState("loading");

    try {
      // Validation: if using wallet/crypto with tokens and price data, ensure total covers required amount
      if (
        (selectedMethod.id === "wallet" || selectedMethod.id === "crypto") &&
        paymentTokens.length > 0 &&
        paymentTokens.some((t) => t.priceUSD !== undefined) &&
        requiredTotal > 0
      ) {
        const hasPrice = paymentTokens.some((t) => t.priceUSD !== undefined);
        if (hasPrice && totalSelectedUSD + 1e-9 < requiredTotal) {
          throw new Error(
            `Insufficient allocation: required ${requiredTotal} ${
              options.currency
            }, allocated ~$${totalSelectedUSD.toFixed(2)}`
          );
        }
      }

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
        allocations:
          selectedMethod.id === "wallet" || selectedMethod.id === "crypto"
            ? tokenAllocations
            : undefined,
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

  // Get selected tokens with allocations > 0
  const selectedTokens = paymentTokens.filter(
    (token) => (tokenAllocations[token.id] ?? 0) > 0
  );

  // Render content based on state
  const renderContent = () => {
    switch (state) {
      case "selection":
        return (
          <div className="mc:grid mc:grid-cols-1 mc:lg:grid-cols-3 mc:gap-6">
            {/* Left Side - Token Selection */}
            <div className="mc:space-y-4 mc:col-span-1 mc:lg:col-span-2">
              <PaymentMethodSelector
                methods={paymentMethods}
                selectedMethod={selectedMethod}
                onSelect={handleMethodSelect}
                amount={options.amount}
                currency={options.currency}
                tokens={paymentTokens}
                tokenAllocations={tokenAllocations}
                onUpdateTokenAllocation={handleUpdateTokenAllocation}
                hideMethods={paymentTokens.length > 0}
              />
            </div>

            {/* Right Side - Payment Summary */}
            <div className="mc:space-y-4 mc:col-span-1 mc:lg:col-span-1">
              <div className="mc:bg-white/5 mc:border mc:border-white/20 mc:rounded-lg mc:p-5">
                <h3 className="mc:text-lg mc:font-bold mc:text-white mc:mb-4">
                  Payment Summary
                </h3>

                {/* Product Info */}
                {typeof options.metadata?.productName === "string" && (
                  <div className="mc:flex mc:justify-between mc:items-center mc:py-2 mc:border-b mc:border-white/10">
                    <span className="mc:text-gray-400">
                      {options.metadata.productName}
                    </span>
                    <span className="mc:text-white mc:font-medium">
                      ${requiredTotal.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Fee (placeholder) */}
                <div className="mc:flex mc:justify-between mc:items-center mc:py-2 mc:border-b mc:border-white/10">
                  <span className="mc:text-gray-400">Fee</span>
                  <span className="mc:text-white mc:font-medium">$0.30</span>
                </div>

                {/* Total Payment */}
                <div className="mc:flex mc:justify-between mc:items-center mc:py-3">
                  <span className="mc:text-gray-400">Total Payment</span>
                  <span className="mc:text-2xl mc:font-bold mc:text-white">
                    ${(requiredTotal + 0.3).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Selected Tokens Detail */}
              <div className="mc:bg-white/5 mc:border mc:border-white/20 mc:rounded-lg mc:p-5">
                <div className="mc:flex mc:items-center mc:justify-between mc:mb-4">
                  <div className="mc:flex mc:items-center mc:gap-2">
                    <span className="mc:text-gray-400 mc:text-sm">ⓘ</span>
                    <span className="mc:text-gray-400 mc:text-sm">
                      Set the coins amount until 100%
                    </span>
                  </div>
                  <div
                    className={`mc:px-3 mc:py-1 mc:rounded-full mc:text-sm mc:font-medium ${
                      Math.abs(totalSelectedUSD - requiredTotal) <= 0.01
                        ? "mc:bg-green-500/20 mc:text-green-400"
                        : totalSelectedUSD > requiredTotal
                        ? "mc:bg-red-500/20 mc:text-red-400"
                        : "mc:bg-purple-500/20 mc:text-purple-400"
                    }`}
                  >
                    {requiredTotal > 0
                      ? `${Math.min(
                          Math.round((totalSelectedUSD / requiredTotal) * 100),
                          999
                        )}/100%`
                      : "0/100%"}
                  </div>
                </div>

                {/* Token List */}
                <div className="mc:space-y-3">
                  {selectedTokens.length > 0 ? (
                    selectedTokens.map((token) => {
                      const amount = tokenAllocations[token.id] ?? 0;
                      const valueUSD = amount * (token.priceUSD || 0);
                      const percentage =
                        requiredTotal > 0
                          ? (valueUSD / requiredTotal) * 100
                          : 0;

                      return (
                        <div
                          key={token.id}
                          className="mc:flex mc:items-center mc:gap-3"
                        >
                          <div className="mc:flex mc:items-center mc:gap-2 mc:min-w-32">
                            {token.icon && (
                              <span className="mc:text-xl">{token.icon}</span>
                            )}
                            <div>
                              <div className="mc:font-medium mc:text-white mc:text-sm">
                                {token.name}
                              </div>
                              <div className="mc:text-xs mc:text-gray-400">
                                {amount.toFixed(4)} {token.symbol}
                              </div>
                            </div>
                          </div>
                          <div className="mc:flex-1 mc:h-2 mc:bg-white/10 mc:rounded-full mc:overflow-hidden">
                            <div
                              className="mc:h-full mc:bg-purple-500 mc:rounded-full mc:transition-all mc:duration-300"
                              style={{
                                width: `${Math.min(percentage, 100)}%`,
                              }}
                            />
                          </div>
                          <div className="mc:text-right mc:min-w-12">
                            <span className="mc:text-white mc:font-medium mc:text-sm">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="mc:text-center mc:py-6 mc:text-gray-500">
                      <p className="mc:text-sm">No tokens selected yet</p>
                      <p className="mc:text-xs mc:mt-1">
                        Use the sliders on the left to allocate tokens
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Button & Validation */}
              {(() => {
                const isWalletOrCrypto =
                  selectedMethod?.id === "wallet" ||
                  selectedMethod?.id === "crypto";
                const hasTokens = paymentTokens.length > 0;
                const hasPriceData = paymentTokens.some(
                  (t) => t.priceUSD !== undefined
                );
                const tolerance = 0.01;
                const isExactAmount =
                  Math.abs(totalSelectedUSD - requiredTotal) <= tolerance;
                const isUnderAmount =
                  totalSelectedUSD < requiredTotal - tolerance;
                const isOverAmount =
                  totalSelectedUSD > requiredTotal + tolerance;

                const isDisabled =
                  !selectedMethod ||
                  (isWalletOrCrypto &&
                    hasTokens &&
                    hasPriceData &&
                    !isExactAmount);

                return (
                  <>
                    <button
                      onClick={handleContinuePayment}
                      disabled={isDisabled}
                      className="mc:w-full mc:bg-purple-600 hover:mc:bg-purple-700 disabled:mc:bg-gray-600 disabled:mc:cursor-not-allowed mc:text-white mc:font-semibold mc:py-4 mc:px-4 mc:rounded-xl mc:transition-colors mc:duration-200"
                    >
                      Pay with MultiCoyn
                    </button>
                    {isWalletOrCrypto && hasTokens && hasPriceData && (
                      <div className="mc:text-center mc:mt-2">
                        {isUnderAmount && (
                          <div className="mc:text-sm mc:text-yellow-400">
                            ⚠️ Need $
                            {(requiredTotal - totalSelectedUSD).toFixed(2)} more
                            to complete payment
                          </div>
                        )}
                        {isOverAmount && (
                          <div className="mc:text-sm mc:text-red-400">
                            ⚠️ Reduce $
                            {(totalSelectedUSD - requiredTotal).toFixed(2)} to
                            match exact amount
                          </div>
                        )}
                        {isExactAmount && totalSelectedUSD > 0 && (
                          <div className="mc:text-sm mc:text-green-400">
                            ✓ Ready to pay
                          </div>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
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
            <div className="mc:w-16 mc:h-16 mc:bg-red-500/20 mc:rounded-full mc:flex mc:items-center mc:justify-center">
              <svg
                className="mc:w-10 mc:h-10 mc:text-red-400"
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
              <h3 className="mc:text-2xl mc:font-bold mc:text-white mc:mb-2">
                Payment Failed
              </h3>
              <p className="mc:text-gray-400">
                There was an error processing your payment
              </p>
            </div>
            <button
              onClick={onClose}
              className="mc:w-full mc:bg-white/10 hover:mc:bg-white/20 mc:text-white mc:font-semibold mc:py-3 mc:px-4 mc:rounded-lg mc:transition-colors mc:duration-200"
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
      className="mc:fixed mc:inset-0 mc:z-9999 mc:flex mc:items-start sm:mc:items-center mc:justify-center mc:bg-black/30 mc:backdrop-blur-sm mc:overflow-y-auto mc:py-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div
        ref={modalRef}
        className={`mc:relative mc:border mc:border-white/40 mc:bg-modal-background mc:rounded-lg mc:shadow-xl mc:max-w-7xl mc:w-full mc:mx-4 mc:my-auto mc:p-4 sm:mc:p-6 mc:transition-all mc:duration-300 mc:max-h-none ${
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
                <span className="mc:inline-block mc:bg-yellow-500/20 mc:text-yellow-400 mc:text-xs mc:font-semibold mc:px-2 mc:py-1 mc:rounded">
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
