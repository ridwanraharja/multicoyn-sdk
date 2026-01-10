import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { TOKENS } from "../config/contracts";
import { useTokenRegistry } from "../hooks/useTokenRegistry";
import { formatNumberWithCommas, getCurrencySymbol } from "../lib/tokens";
import {
  CloseIcon,
  InfoIcon,
  ProcessingIcon,
  SearchIcon,
  SuccessIcon,
} from "./icons";
import { PaymentSummary } from "./PaymentSummary";
import { TokenSlider } from "./TokenSlider";
import type { PaymentItem, Token } from "./types";

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
  isError?: boolean;
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
  isError: externalIsError,
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
        updatedTokens.forEach((t) => {
          t.percentage = 0;
        });

        const totalPayment = totalAmount + fee * totalAmount;

        const stablecoins = updatedTokens.filter(
          (t) =>
            (t.address === TOKENS.USDC ||
              t.address === TOKENS.USDT ||
              t.address === TOKENS.DAI) &&
            t.amount > 0 &&
            t.priceUSD > 0
        );

        const otherTokens = updatedTokens.filter(
          (t) =>
            t.address !== TOKENS.USDC &&
            t.address !== TOKENS.USDT &&
            t.address !== TOKENS.DAI &&
            t.amount > 0 &&
            t.priceUSD > 0
        );

        const totalStablecoinBalanceUSD = stablecoins.reduce(
          (sum, t) => sum + t.amount * t.priceUSD,
          0
        );

        if (
          stablecoins.length > 0 &&
          totalStablecoinBalanceUSD >= totalPayment
        ) {
          const perToken = Math.floor(100 / stablecoins.length);
          const remainder = 100 - perToken * stablecoins.length;

          stablecoins.forEach((t, i) => {
            t.percentage = perToken + (i === 0 ? remainder : 0);
          });
        } else if (stablecoins.length > 0) {
          const stablecoinPercentage =
            (totalStablecoinBalanceUSD / totalPayment) * 100;
          const perStablecoin = Math.floor(
            stablecoinPercentage / stablecoins.length
          );

          stablecoins.forEach((t) => {
            t.percentage = perStablecoin;
          });

          const usedPercentage = stablecoins.reduce(
            (sum, t) => sum + t.percentage,
            0
          );
          const remainingPercentage = 100 - usedPercentage;

          if (otherTokens.length > 0 && remainingPercentage > 0) {
            const perOtherToken = Math.floor(
              remainingPercentage / otherTokens.length
            );
            const otherRemainder =
              remainingPercentage - perOtherToken * otherTokens.length;

            otherTokens.forEach((t, i) => {
              t.percentage = perOtherToken + (i === 0 ? otherRemainder : 0);
            });
          }
        } else {
          const activeTokens = updatedTokens.filter(
            (t) => t.amount > 0 && t.priceUSD > 0
          );
          if (activeTokens.length > 0) {
            const perToken = Math.floor(100 / activeTokens.length);
            const remainder = 100 - perToken * activeTokens.length;

            activeTokens.forEach((t, i) => {
              t.percentage = perToken + (i === 0 ? remainder : 0);
            });
          }
        }
      }

      setTokens(updatedTokens);
    }
  }, [
    isOpen,
    tokenKey,
    ethPrice,
    usdcPrice,
    usdtPrice,
    daiPrice,
    wbtcPrice,
    autoOptimize,
  ]);

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
    } else if (externalIsError) {
      setView("form");
      setProgress(0);
      setProcessingMessage("Preparing payment...");
      setApprovingTokens([]);
    }
  }, [
    externalIsSuccess,
    externalIsProcessing,
    externalIsError,
    transactionHash,
  ]);

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
      t.amount > 0 &&
      (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.chain.toLowerCase().includes(searchQuery.toLowerCase()))
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
    <div className="multicoyn-sdk mc:fixed mc:inset-0 mc:z-9999 mc:flex mc:items-center mc:justify-center">
      <div
        className="mc:absolute mc:inset-0 mc:bg-black/60 mc:backdrop-blur-sm"
        onClick={view === "form" ? onClose : undefined}
      />

      {view === "processing" && (
        <div className="mc:relative mc:bg-dark-2 mc:border mc:border-border mc:rounded-xl mc:p-4 mc:flex mc:flex-col mc:gap-5 mc:items-center mc:justify-center mc:w-full mc:max-w-[400px] mc:min-h-[280px] mc:mx-4 animate-slide-in-right">
          <ProcessingIcon size={134} />
          <div className="mc:flex mc:flex-col mc:gap-3 mc:items-center mc:w-full mc:max-w-[300px] mc:px-2">
            <div className="mc:relative mc:w-full mc:max-w-[234px] mc:h-1.5">
              <div className="mc:absolute mc:inset-0 mc:bg-dark-4 mc:rounded-full" />
              <div
                className="mc:absolute mc:left-0 mc:top-0 mc:h-full mc:bg-secondary mc:rounded-full mc:transition-all mc:duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="mc:text-sm mc:text-white mc:text-center mc:wrap-break-word mc:px-2">
              {processingMessage}
            </p>
            {approvingTokens.length > 0 && (
              <div className="mc:text-xs mc:text-white/60 mc:text-center mc:wrap-break-word mc:px-2">
                Approving: {approvingTokens.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      {view === "success" && (
        <div className="mc:relative mc:bg-dark-2 mc:border mc:border-border mc:rounded-xl mc:p-4 mc:flex mc:flex-col mc:gap-8 mc:items-start mc:w-full mc:max-w-[380px] mc:mx-4 animate-slide-in-right">
          <div className="mc:flex mc:flex-col mc:gap-6 mc:items-center mc:w-full">
            <SuccessIcon size={95} />
            <div className="mc:flex mc:flex-col mc:items-center mc:justify-center mc:w-full">
              <div className="mc:flex mc:flex-col mc:gap-1 mc:items-center mc:text-white mc:px-2">
                <p className="mc:text-lg mc:font-semibold mc:text-center">
                  Payment Success
                </p>
                <p className="mc:text-sm mc:text-center">
                  Your payment has been successfully done.
                </p>
              </div>
            </div>

            <div className="mc:bg-dark-4 mc:border mc:border-white/10 mc:rounded-lg mc:py-3 mc:px-4 mc:w-full mc:max-w-[348px] mc:flex mc:flex-col mc:items-center">
              <div className="mc:flex mc:flex-col mc:gap-2 mc:w-full">
                <p className="mc:text-xs mc:text-white">Order Details:</p>
                <div className="mc:flex mc:items-center mc:gap-4 mc:sm:gap-8 mc:text-sm mc:text-white mc:w-full">
                  <span className="mc:min-w-[85px] mc:shrink-0">Item</span>
                  <span className="mc:flex-1 mc:text-right mc:wrap-break-word">
                    {items[0]?.name || "Item"}
                  </span>
                </div>
                <div className="mc:flex mc:items-center mc:gap-4 mc:sm:gap-8 mc:text-white mc:w-full">
                  <span className="mc:text-sm mc:min-w-[106px] mc:shrink-0">
                    Total Payment
                  </span>
                  <span className="mc:flex-1 mc:text-base mc:font-semibold mc:text-right mc:wrap-break-word">
                    {formatNumberWithCommas(displayTotalPayment)}{" "}
                    {displayCurrency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mc:h-px mc:w-full mc:max-w-[320px] mc:bg-white/20" />

          <div className="mc:flex mc:flex-col mc:gap-2 mc:items-center mc:justify-center mc:w-full mc:text-xs mc:text-white mc:px-5">
            <p className="mc:text-center">{formatDate()}</p>
            {transactionId && (
              <a
                href={`https://sepolia-blockscout.lisk.com/tx/${transactionId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mc:text-cyan hover:mc:underline mc:text-center mc:break-all"
              >
                View Transaction
              </a>
            )}
          </div>

          <button
            onClick={handleBackToHome}
            className="mc:w-full mc:h-[42px] mc:bg-secondary hover:mc:bg-secondary/90 mc:rounded-lg mc:flex mc:items-center mc:justify-center mc:text-sm mc:font-semibold mc:text-white mc:transition-all"
          >
            Back to Home
          </button>
        </div>
      )}

      {view === "form" && (
        <div className="mc:relative mc:bg-dark-2 mc:border mc:border-border mc:rounded-xl mc:p-4 mc:flex mc:flex-col mc:gap-5 mc:max-w-[1000px] mc:w-full mc:mx-4 mc:max-h-[90vh] mc:overflow-y-auto animate-slide-in-right">
          <div className="mc:flex mc:items-center mc:gap-4">
            <div className="mc:flex-1 mc:flex mc:flex-col mc:gap-1 mc:min-w-0">
              <h2 className="mc:text-lg mc:sm:text-xl mc:text-white mc:font-normal mc:wrap-break-word">
                Complete Payment
              </h2>
              <p className="mc:text-sm mc:sm:text-base mc:text-white/70 mc:wrap-break-word">
                Choose how you want to pay (supports multi-token for wallets)
              </p>
            </div>
            <button
              onClick={onClose}
              className="mc:text-white/60 hover:mc:text-white mc:transition-colors mc:shrink-0"
            >
              <CloseIcon size={26} />
            </button>
          </div>

          <div className="mc:flex mc:gap-5 mc:flex-col mc:lg:flex-row">
            <div className="mc:flex-1 mc:flex mc:flex-col mc:gap-5">
              <div className="mc:bg-dark-4 mc:rounded-md mc:p-4 mc:flex mc:items-center mc:gap-3 mc:sm:gap-5 mc:flex-col mc:md:flex-row">
                <span className="mc:text-sm mc:sm:text-base mc:text-white/60 mc:min-w-[120px] mc:shrink-0">
                  Total Required
                </span>
                <span className="mc:text-lg mc:sm:text-xl mc:font-bold mc:text-white mc:text-right mc:flex-1 mc:min-w-0 mc:wrap-break-word">
                  {formatNumberWithCommas(displayTotalPayment)}{" "}
                  {displayCurrency}
                </span>
              </div>

              <div className="mc:flex mc:items-center mc:gap-3 mc:sm:gap-5 mc:flex-wrap">
                <span className="mc:text-sm mc:sm:text-base mc:text-white mc:flex-1 mc:min-w-0">
                  Use your tokens
                </span>
                <div className="mc:bg-dark-4 mc:rounded-md mc:px-3 mc:py-2 mc:flex mc:items-center mc:gap-2 mc:flex-1 mc:sm:flex-initial mc:min-w-0">
                  <SearchIcon
                    size={16}
                    className="mc:text-white/60 mc:shrink-0"
                  />
                  <input
                    type="text"
                    placeholder="Search token or chain.."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mc:bg-transparent mc:border-none mc:outline-none mc:text-sm mc:sm:text-base mc:text-white/60 placeholder:mc:text-white/60 mc:w-full mc:min-w-0"
                  />
                </div>
              </div>

              <div className="mc:bg-dark-3 mc:rounded-md mc:p-3 mc:flex mc:flex-col mc:gap-4">
                <div className="mc:flex mc:items-center mc:gap-3 mc:sm:gap-6 mc:flex-col mc:md:flex-row">
                  <div className="mc:flex-1 mc:flex mc:items-center mc:gap-2 mc:min-w-0 mc:flex-wrap">
                    <InfoIcon
                      size={16}
                      className="mc:text-white/60 mc:shrink-0"
                    />
                    <span className="mc:text-xs mc:sm:text-sm mc:italic mc:text-white mc:wrap-break-word">
                      Set the coins amount until 100%
                    </span>
                    <span
                      className={`mc:bg-dark-4 mc:rounded-full mc:px-2 mc:py-1 mc:text-xs mc:font-semibold mc:shrink-0 ${
                        totalPercentage === 100
                          ? "mc:text-cyan"
                          : "mc:text-warning"
                      }`}
                    >
                      {totalPercentage}/100%
                    </span>
                  </div>
                  <div className="mc:flex mc:items-center mc:gap-2 mc:shrink-0">
                    <span className="mc:text-xs mc:sm:text-sm mc:text-white">
                      Auto Optimize
                    </span>
                    <button
                      onClick={handleAutoOptimize}
                      className={`mc:w-7 mc:h-4 mc:rounded-full mc:relative mc:transition-colors ${
                        autoOptimize ? "mc:bg-cyan" : "mc:bg-white/40"
                      }`}
                    >
                      <div
                        className={`mc:absolute mc:top-0.5 mc:size-3 mc:rounded-full mc:bg-white mc:transition-transform ${
                          autoOptimize
                            ? "mc:translate-x-3.5"
                            : "mc:translate-x-0.5"
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
            <div className="mc:w-full mc:lg:w-[320px]">
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
            className={`mc:w-full mc:lg:w-[620px] mc:h-[42px] mc:rounded-lg mc:flex mc:items-center mc:justify-center mc:text-xs mc:sm:text-sm mc:font-semibold mc:text-white mc:transition-all mc:px-2 mc:wrap-break-word ${
              totalPercentage === 100 &&
              !hasInsufficientBalance &&
              !hasInvalidPrice
                ? "mc:bg-secondary hover:mc:bg-secondary/90"
                : "mc:bg-secondary/50 mc:cursor-not-allowed"
            }`}
          >
            <span className="mc:text-center">
              {hasInvalidPrice
                ? "Price data unavailable - Please wait"
                : hasInsufficientBalance
                ? "Insufficient Balance"
                : totalPercentage !== 100
                ? `Complete to 100% (${totalPercentage}%)`
                : "Pay with MultiCoyn"}
            </span>
          </button>
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}
