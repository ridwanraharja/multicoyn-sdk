import { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { PaymentModal } from "./PaymentModal";
import {
  useMultiTokenBalances,
  useMultiTokenPrices,
  usePaymentRouter,
  useTokenRegistry,
} from "../hooks";
import type {
  Token,
  PaymentItem,
  PaymentResult,
  MulticoynButtonProps,
} from "./types";
import { TOKENS } from "../config/contracts";
import { TOKEN_METADATA } from "../constants/payment";
import { parseWeb3Error } from "../lib/errors";

const USD_SCALE = 1e8;

const calculateTotalAmount = (items: PaymentItem[]): number => {
  return items.reduce((total, item) => total + item.price, 0);
};

export function MulticoynButton({
  merchantAddress,
  items,
  config,
  onPaymentComplete,
  onPaymentError,
  className = "",
  children,
}: MulticoynButtonProps) {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const currency = config?.currency ?? "USD";
  const target = config?.target;
  const callData = config?.callData;

  const totalAmount = calculateTotalAmount(items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);

  const tokenRegistry = useTokenRegistry();
  const { balances, isLoading: balancesLoading } = useMultiTokenBalances();
  const { prices, isLoading: pricesLoading } = useMultiTokenPrices();

  const { data: idrxPriceData } = tokenRegistry.useGetTokenPrice(TOKENS.IDRX);
  const { executePayment, isConfirmed, hash, error, isPending, isConfirming } =
    usePaymentRouter();

  const extractIdrxPrice = (): number => {
    if (!idrxPriceData) return 1 / 15600;

    if (Array.isArray(idrxPriceData) && idrxPriceData.length >= 1) {
      const price = idrxPriceData[0];
      if (typeof price === "bigint") {
        return Number(price) / USD_SCALE;
      }
    }
    return 1 / 15600;
  };

  const idrToUsdRate = extractIdrxPrice();

  const totalAmountUSD =
    currency === "IDR" ? totalAmount * idrToUsdRate : totalAmount;

  const handleClick = () => {
    if (!isConnected) {
      connect({ connector: connectors[0] });
    } else {
      setIsModalOpen(true);
    }
  };

  const handlePaymentSubmit = async (selectedTokens: Token[]) => {
    try {
      await executePayment({
        merchantAddress,
        tokens: selectedTokens,
        totalAmountUSD,
        settleInIDR: currency === "IDR",
        target,
        callData,
      });
    } catch (error) {
      const parsedError = parseWeb3Error(error);
      onPaymentError?.(parsedError);
    }
  };

  useEffect(() => {
    if (!balancesLoading && !pricesLoading) {
      const tokenList: Token[] = [
        {
          id: "eth",
          name: TOKEN_METADATA.ETH.name,
          symbol: TOKEN_METADATA.ETH.symbol,
          amount: balances.ETH,
          chain: "Lisk Sepolia",
          percentage: 0,
          address: TOKENS.NATIVE,
          decimals: TOKEN_METADATA.ETH.decimals,
          priceUSD: prices.ETH,
          tokenIcon: TOKEN_METADATA.ETH.logo,
        },
        {
          id: "usdc",
          name: TOKEN_METADATA.USDC.name,
          symbol: TOKEN_METADATA.USDC.symbol,
          amount: balances.USDC,
          chain: "Lisk Sepolia",
          percentage: 0,
          address: TOKENS.USDC,
          decimals: TOKEN_METADATA.USDC.decimals,
          priceUSD: prices.USDC,
          tokenIcon: TOKEN_METADATA.USDC.logo,
        },
        {
          id: "usdt",
          name: TOKEN_METADATA.USDT.name,
          symbol: TOKEN_METADATA.USDT.symbol,
          amount: balances.USDT,
          chain: "Lisk Sepolia",
          percentage: 0,
          address: TOKENS.USDT,
          decimals: TOKEN_METADATA.USDT.decimals,
          priceUSD: prices.USDT,
          tokenIcon: TOKEN_METADATA.USDT.logo,
        },
        {
          id: "dai",
          name: TOKEN_METADATA.DAI.name,
          symbol: TOKEN_METADATA.DAI.symbol,
          amount: balances.DAI,
          chain: "Lisk Sepolia",
          percentage: 0,
          address: TOKENS.DAI,
          decimals: TOKEN_METADATA.DAI.decimals,
          priceUSD: prices.DAI,
          tokenIcon: TOKEN_METADATA.DAI.logo,
        },
        {
          id: "wbtc",
          name: TOKEN_METADATA.WBTC.name,
          symbol: TOKEN_METADATA.WBTC.symbol,
          amount: balances.WBTC,
          chain: "Lisk Sepolia",
          percentage: 0,
          address: TOKENS.WBTC,
          decimals: TOKEN_METADATA.WBTC.decimals,
          priceUSD: prices.WBTC,
          tokenIcon: TOKEN_METADATA.WBTC.logo,
        },
      ];
      setTokens(tokenList);
    }
  }, [
    balances.ETH,
    balances.USDC,
    balances.USDT,
    balances.DAI,
    balances.WBTC,
    prices.ETH,
    prices.USDC,
    prices.USDT,
    prices.DAI,
    prices.WBTC,
    balancesLoading,
    pricesLoading,
  ]);

  useEffect(() => {
    if (isConfirmed && hash) {
      const result: PaymentResult = {
        success: true,
        transactionId: hash,
        tokens: tokens.filter((t) => t.percentage > 0),
      };
      onPaymentComplete?.(result);
    }
  }, [isConfirmed, hash]);

  useEffect(() => {
    if (error) {
      const parsedError = parseWeb3Error(error);
      onPaymentError?.(parsedError);
    }
  }, [error]);

  return (
    <>
      <button
        onClick={handleClick}
        disabled={balancesLoading || pricesLoading}
        className={`mc:bg-secondary hover:mc:bg-secondary/90 mc:text-white mc:font-semibold mc:py-3 mc:px-6 mc:rounded-lg mc:transition-all disabled:mc:opacity-50 disabled:mc:cursor-not-allowed ${className}`}
      >
        {children ||
          (isConnected ? "Pay with MultiCoyn" : "Connect Wallet to Pay")}
      </button>

      {isConnected && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          totalAmount={totalAmountUSD}
          currency={currency}
          items={items}
          tokens={tokens}
          onPaymentSubmit={handlePaymentSubmit}
          transactionHash={hash}
          isProcessing={isPending || isConfirming}
          isSuccess={isConfirmed}
          conversionRate={idrToUsdRate}
        />
      )}
    </>
  );
}
