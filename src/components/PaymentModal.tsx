import { useState, useEffect } from "react";
import {
  CloseIcon,
  SearchIcon,
  InfoIcon,
  ProcessingIcon,
  SuccessIcon,
} from "./icons";
import { TokenSlider } from "./TokenSlider";
import { PaymentSummary } from "./PaymentSummary";
import type { Token, PaymentItem } from "./types";

type ModalView = "form" | "processing" | "success";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  currency?: string;
  items: PaymentItem[];
  tokens: Token[];
  onPaymentSubmit: (tokens: Token[]) => void;
  fee?: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  currency = "USDT",
  items,
  tokens: initialTokens,
  onPaymentSubmit,
  fee = 0.3,
}: PaymentModalProps) {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [view, setView] = useState<ModalView>("form");
  const [progress, setProgress] = useState(0);
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    setTokens(initialTokens);
  }, [initialTokens]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setView("form");
      setProgress(0);
      setTransactionId("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (view === "processing") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTransactionId(
              `#ID${Math.random().toString(36).substring(2, 12).toUpperCase()}`
            );
            setView("success");
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [view]);

  const totalPercentage = tokens.reduce((sum, t) => sum + t.percentage, 0);
  const totalPayment = items.reduce((sum, item) => sum + item.price, 0) + fee;

  const handleTokenChange = (tokenId: string, percentage: number) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === tokenId ? { ...t, percentage } : t))
    );
  };

  const handleAutoOptimize = () => {
    if (!autoOptimize) {
      const activeTokens = tokens.filter((t) => t.amount > 0);
      const perToken = Math.floor(100 / activeTokens.length);
      const remainder = 100 - perToken * activeTokens.length;

      setTokens((prev) =>
        prev.map((t, i) => ({
          ...t,
          percentage: t.amount > 0 ? perToken + (i === 0 ? remainder : 0) : 0,
        }))
      );
    }
    setAutoOptimize(!autoOptimize);
  };

  const filteredTokens = tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.chain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    setView("processing");
    onPaymentSubmit(tokens);
  };

  const handleBackToHome = () => {
    onClose();
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={view === "form" ? onClose : undefined}
      />

      {view === "processing" && (
        <div className="relative bg-dark-2 border border-border rounded-xl p-4 flex flex-col gap-5 items-center justify-center w-[400px] h-[280px] mx-4 animate-slide-in-right">
          <ProcessingIcon size={134} />
          <div className="flex flex-col gap-3 items-center w-[300px]">
            <div className="relative w-[234px] h-1.5">
              <div className="absolute inset-0 bg-dark-4 rounded-full" />
              <div
                className="absolute left-0 top-0 h-full bg-secondary rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-sm text-white text-center">
              Please wait, payment Processed..
            </p>
          </div>
        </div>
      )}

      {view === "success" && (
        <div className="relative bg-dark-2 border border-border rounded-xl p-4 flex flex-col gap-8 items-start w-[380px] mx-4 animate-slide-in-right">
          <div className="flex flex-col gap-6 items-center w-full">
            <SuccessIcon size={95} />
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex flex-col gap-1 items-center text-white">
                <p className="text-lg font-semibold">Payment Success</p>
                <p className="text-sm">
                  Your payment has been successfully done.
                </p>
              </div>
            </div>

            <div className="bg-dark-4 border border-white/10 rounded-lg py-3 px-0 w-[348px] flex flex-col items-center">
              <div className="flex flex-col gap-2 w-[318px]">
                <p className="text-xs text-white">Order Details:</p>
                <div className="flex items-center gap-8 text-sm text-white w-full">
                  <span className="w-[85px]">Item</span>
                  <span className="flex-1 text-right">
                    {items[0]?.name || "Item"}
                  </span>
                </div>
                <div className="flex items-center gap-8 text-white w-full">
                  <span className="text-sm w-[106px]">Total Payment</span>
                  <span className="flex-1 text-base font-semibold text-right">
                    ${totalPayment.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-[320px] bg-white/20" />

          <div className="flex flex-col gap-2 items-center justify-center w-full text-xs text-white px-5">
            <p>{formatDate()}</p>
            <p>Transaction ID {transactionId}</p>
          </div>

          <button
            onClick={handleBackToHome}
            className="w-full h-[42px] bg-secondary hover:bg-secondary/90 rounded-lg flex items-center justify-center text-sm font-semibold text-white transition-all"
          >
            Back to Home
          </button>
        </div>
      )}

      {view === "form" && (
        <div className="relative bg-dark-2 border border-border rounded-xl p-4 flex flex-col gap-5 max-w-[1000px] w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-in-right">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <h2 className="text-xl text-white font-normal">
                Complete Payment
              </h2>
              <p className="text-base text-white/70">
                Choose how you want to pay (supports multi-token for wallets)
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <CloseIcon size={26} />
            </button>
          </div>

          <div className="flex gap-5 flex-col lg:flex-row">
            <div className="flex-1 flex flex-col gap-5">
              <div className="bg-dark-4 rounded-md p-4 flex items-center gap-5">
                <span className="text-base text-white/60 w-[340px]">
                  Total Required
                </span>
                <span className="text-xl font-bold text-white text-right flex-1">
                  {totalAmount} {currency}
                </span>
              </div>

              <div className="flex items-center gap-5">
                <span className="text-base text-white flex-1">
                  Use your tokens
                </span>
                <div className="bg-dark-4 rounded-md px-3 py-2 flex items-center gap-2">
                  <SearchIcon size={16} className="text-white/60" />
                  <input
                    type="text"
                    placeholder="Search token or chain.."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-base text-white/60 placeholder:text-white/60"
                  />
                </div>
              </div>

              <div className="bg-dark-3 rounded-md p-3 flex flex-col gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex-1 flex items-center gap-2">
                    <InfoIcon size={16} className="text-white/60" />
                    <span className="text-sm italic text-white">
                      Set the coins amount until 100%
                    </span>
                    <span
                      className={`bg-dark-4 rounded-full px-2 py-1 text-xs font-semibold ${
                        totalPercentage === 100 ? "text-cyan" : "text-warning"
                      }`}
                    >
                      {totalPercentage}/100%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white">Auto Optimize</span>
                    <button
                      onClick={handleAutoOptimize}
                      className={`w-7 h-4 rounded-full relative transition-colors ${
                        autoOptimize ? "bg-cyan" : "bg-white/40"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 size-3 rounded-full bg-white transition-transform ${
                          autoOptimize ? "translate-x-3.5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {filteredTokens.map((token) => (
                  <TokenSlider
                    key={token.id}
                    token={token}
                    onChange={(percentage) =>
                      handleTokenChange(token.id, percentage)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Payment Summary */}
            <div className="w-full lg:w-[320px]">
              <PaymentSummary items={items} fee={fee} />
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handleSubmit}
            disabled={totalPercentage !== 100}
            className={`w-full lg:w-[620px] h-[42px] rounded-lg flex items-center justify-center text-sm font-semibold text-white transition-all ${
              totalPercentage === 100
                ? "bg-secondary hover:bg-secondary/90"
                : "bg-secondary/50 cursor-not-allowed"
            }`}
          >
            Pay with MultiCoyn
          </button>
        </div>
      )}
    </div>
  );
}
