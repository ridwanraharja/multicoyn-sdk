import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
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
import { TOKENS } from "../config/contracts";
import { useTokenRegistry } from "../hooks/useTokenRegistry";
import { getCurrencySymbol, formatNumberWithCommas } from "../lib/tokens";

type ModalView = "form" | "processing" | "success";

const USD_SCALE = 1e8;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  currency?: string;
  items: PaymentItem[];
  tokens: Token[];
  onPaymentSubmit: (tokens: Token[]) => void;
  fee?: number;
  transactionHash?: string;
  isProcessing?: boolean;
  isSuccess?: boolean;
  conversionRate?: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  currency = "USD",
  items,
  tokens: initialTokens,
  onPaymentSubmit,
  fee = 0.003,
  transactionHash,
  isProcessing: externalIsProcessing,
  isSuccess: externalIsSuccess,
  conversionRate = 1,
}: PaymentModalProps) {
  const tokenRegistry = useTokenRegistry();

  const { data: ethPrice } = tokenRegistry.useGetTokenPrice(TOKENS.NATIVE);
  const { data: usdcPrice } = tokenRegistry.useGetTokenPrice(TOKENS.USDC);
  const { data: usdtPrice } = tokenRegistry.useGetTokenPrice(TOKENS.USDT);
  const { data: daiPrice } = tokenRegistry.useGetTokenPrice(TOKENS.DAI);
  const { data: wbtcPrice } = tokenRegistry.useGetTokenPrice(TOKENS.WBTC);

  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [view, setView] = useState<ModalView>("form");
  const [progress, setProgress] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [approvingTokens, setApprovingTokens] = useState<string[]>([]);
  const [processingMessage, setProcessingMessage] = useState(
    "Preparing payment..."
  );

  const tokenKey = useMemo(
    () =>
      JSON.stringify(
        initialTokens.map((t) => ({
          id: t.id,
          amount: t.amount,
          priceUSD: t.priceUSD,
        }))
      ),
    [initialTokens]
  );

  const extractPrice = (priceData: unknown): number => {
    if (!priceData) return 0;
    if (Array.isArray(priceData) && priceData.length >= 1) {
      const price = priceData[0];
      if (typeof price === "bigint") {
        return Number(price) / USD_SCALE;
      }
    }
    return 0;
  };

  useEffect(() => {
    if (isOpen && initialTokens.length > 0) {
      const updatedTokens = initialTokens.map((t) => {
        let updatedPrice = t.priceUSD;

        if (t.address === TOKENS.NATIVE && ethPrice) {
          updatedPrice = extractPrice(ethPrice);
        } else if (t.address === TOKENS.USDC && usdcPrice) {
          updatedPrice = extractPrice(usdcPrice);
        } else if (t.address === TOKENS.USDT && usdtPrice) {
          updatedPrice = extractPrice(usdtPrice);
        } else if (t.address === TOKENS.DAI && daiPrice) {
          updatedPrice = extractPrice(daiPrice);
        } else if (t.address === TOKENS.WBTC && wbtcPrice) {
          updatedPrice = extractPrice(wbtcPrice);
        }

        return { ...t, priceUSD: updatedPrice };
      });

      if (autoOptimize) {
        const activeTokens = updatedTokens.filter(
          (t) => t.amount > 0 && t.priceUSD > 0
        );
        if (activeTokens.length > 0) {
          const perToken = Math.floor(100 / activeTokens.length);
          const remainder = 100 - perToken * activeTokens.length;

          updatedTokens.forEach((t, i) => {
            t.percentage =
              t.amount > 0 && t.priceUSD > 0
                ? perToken + (i === 0 ? remainder : 0)
                : 0;
          });
        }
      }

      setTokens(updatedTokens);
    }
  }, [isOpen, tokenKey, ethPrice, usdcPrice, usdtPrice, daiPrice, wbtcPrice]);

  useEffect(() => {
    if (!isOpen) {
      setView("form");
      setProgress(0);
      setTransactionId("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (externalIsSuccess && transactionHash) {
      setProgress(100);
      setTransactionId(transactionHash);
      setView("success");
      setProcessingMessage("Payment completed!");
    } else if (externalIsProcessing) {
      setProgress(80);
      setProcessingMessage("Confirming transaction...");
    }
  }, [externalIsSuccess, externalIsProcessing, transactionHash]);

  const totalPercentage = tokens.reduce((sum, t) => sum + t.percentage, 0);
  const displayCurrency = getCurrencySymbol(currency);

  const usdToDisplayRate = currency === "IDR" ? 1 / conversionRate : 1;

  // Items already in correct currency (IDR or USD), no conversion needed
  const displayItems = items.map((item) => ({
    ...item,
    price: item.price,
  }));

  const totalFeeUSD = fee * totalAmount;
  const totalPaymentUSD = totalAmount + totalFeeUSD;

  const displayTotalFee = totalFeeUSD * usdToDisplayRate;
  const displayTotalPayment = totalPaymentUSD * usdToDisplayRate;

  const hasInvalidPrice = tokens.some((token) => {
    if (token.percentage === 0) return false;
    return !token.priceUSD || token.priceUSD <= 0;
  });

  const hasInsufficientBalance = tokens.some((token) => {
    if (token.percentage === 0) return false;
    const usdValue = (totalPaymentUSD * token.percentage) / 100;
    const tokenAmountNeeded =
      token.priceUSD > 0 ? usdValue / token.priceUSD : 0;
    return tokenAmountNeeded > token.amount;
  });

  const handleTokenChange = (tokenId: string, percentage: number) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === tokenId ? { ...t, percentage } : t))
    );
  };

  const handleAutoOptimize = () => {
    if (!autoOptimize) {
      // Only consider tokens with valid balance AND valid price
      const activeTokens = tokens.filter((t) => t.amount > 0 && t.priceUSD > 0);
      const perToken = Math.floor(100 / activeTokens.length);
      const remainder = 100 - perToken * activeTokens.length;

      setTokens((prev) =>
        prev.map((t, i) => ({
          ...t,
          percentage:
            t.amount > 0 && t.priceUSD > 0
              ? perToken + (i === 0 ? remainder : 0)
              : 0,
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

  const handleSubmit = async () => {
    setView("processing");
    setProgress(10);
    setProcessingMessage("Checking token approvals...");

    const tokensToApprove = tokens.filter(
      (t) => t.percentage > 0 && t.address !== TOKENS.NATIVE
    );

    if (tokensToApprove.length > 0) {
      setProcessingMessage(
        `Requesting approval for ${tokensToApprove.length} token(s)...`
      );
      setApprovingTokens(tokensToApprove.map((t) => t.symbol));
    }

    setProgress(30);
    setProcessingMessage("Processing payment...");

    onPaymentSubmit(tokens);

    setProgress(60);
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

  const modalContent = (
    <div className="multicoyn-sdk fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={view === "form" ? onClose : undefined}
      />

      {view === "processing" && (
        <div className="relative bg-dark-2 border border-border rounded-xl p-4 flex flex-col gap-5 items-center justify-center w-[400px] min-h-[280px] mx-4 animate-slide-in-right">
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
              {processingMessage}
            </p>
            {approvingTokens.length > 0 && (
              <div className="text-xs text-white/60 text-center">
                Approving: {approvingTokens.join(", ")}
              </div>
            )}
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
                    {formatNumberWithCommas(displayTotalPayment)}{" "}
                    {displayCurrency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-[320px] bg-white/20" />

          <div className="flex flex-col gap-2 items-center justify-center w-full text-xs text-white px-5">
            <p>{formatDate()}</p>
            {transactionId && (
              <a
                href={`https://sepolia-blockscout.lisk.com/tx/${transactionId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan hover:underline"
              >
                View Transaction
              </a>
            )}
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
                  {formatNumberWithCommas(displayTotalPayment)}{" "}
                  {displayCurrency}
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
                    totalAmount={totalPaymentUSD}
                    displayAmount={displayTotalPayment}
                    currency={currency}
                    onChange={(percentage) =>
                      handleTokenChange(token.id, percentage)
                    }
                    disabled={autoOptimize}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Payment Summary */}
            <div className="w-full lg:w-[320px]">
              <PaymentSummary
                items={displayItems}
                fee={displayTotalFee}
                currency={currency}
              />
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handleSubmit}
            disabled={
              totalPercentage !== 100 ||
              hasInsufficientBalance ||
              hasInvalidPrice
            }
            className={`w-full lg:w-[620px] h-[42px] rounded-lg flex items-center justify-center text-sm font-semibold text-white transition-all ${
              totalPercentage === 100 &&
              !hasInsufficientBalance &&
              !hasInvalidPrice
                ? "bg-secondary hover:bg-secondary/90"
                : "bg-secondary/50 cursor-not-allowed"
            }`}
          >
            {hasInvalidPrice
              ? "Price data unavailable - Please wait"
              : hasInsufficientBalance
              ? "Insufficient Balance"
              : totalPercentage !== 100
              ? `Complete to 100% (${totalPercentage}%)`
              : "Pay with MultiCoyn"}
          </button>
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}
