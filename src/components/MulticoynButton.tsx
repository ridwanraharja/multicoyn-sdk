import { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { PaymentModal } from "./PaymentModal";
import {
  useMultiTokenBalances,
  useMultiTokenPrices,
  usePaymentRouter,
  useTokenRegistry,
} from "../hooks";
import type { Token, PaymentItem, PaymentResult } from "./types";
import { TOKENS } from "../config/contracts";
import { TOKEN_METADATA } from "../constants/payment";
import { parseWeb3Error } from "../lib/errors";

interface MulticoynButtonProps {
  totalAmount: number;
  merchantAddress: `0x${string}`;
  currency?: string;
  items: PaymentItem[];
  settleInIDR?: boolean;
  onPaymentComplete?: (result: PaymentResult) => void;
  onPaymentError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
}

export function MulticoynButton({
  totalAmount,
  merchantAddress,
  currency = "USD",
  items,
  settleInIDR = false,
  onPaymentComplete,
  onPaymentError,
  className = "",
  children,
}: MulticoynButtonProps) {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);

  const { balances, isLoading: balancesLoading } = useMultiTokenBalances();
  const { prices, isLoading: pricesLoading } = useMultiTokenPrices();

  console.log("Token prices from useMultiTokenPrices:", prices);

  const { executePayment, isConfirmed, hash, error, isPending, isConfirming } =
    usePaymentRouter();

  // Get IDRX price for IDR to USD conversion
  const tokenRegistry = useTokenRegistry();
  const { data: idrxPriceData } = tokenRegistry.useGetTokenPrice(TOKENS.IDRX);

  // Calculate IDR to USD rate from IDRX price
  // getTokenPriceUSD returns [price, timestamp] tuple
  // idrxPriceData is in 1e8 scale, so divide by 1e8 to get USD value
  // Example: 6400 / 1e8 = 0.000064 USD per IDRX
  const USD_SCALE = 1e8;
  const extractIdrxPrice = (): number => {
    if (!idrxPriceData) return 1 / 15600;
    // Handle tuple [price, timestamp]
    if (Array.isArray(idrxPriceData) && idrxPriceData.length >= 1) {
      const price = idrxPriceData[0];
      if (typeof price === 'bigint') {
        return Number(price) / USD_SCALE;
      }
    }
    return 1 / 15600;
  };
  const idrToUsdRate = extractIdrxPrice();

  // Build token list from balances and prices
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
        },
      ];
      setTokens(tokenList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Handle payment success
  useEffect(() => {
    if (isConfirmed && hash) {
      const result: PaymentResult = {
        success: true,
        transactionId: hash,
        tokens: tokens.filter((t) => t.percentage > 0),
      };
      onPaymentComplete?.(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, hash]);

  // Handle payment error
  useEffect(() => {
    if (error) {
      const parsedError = parseWeb3Error(error);
      onPaymentError?.(parsedError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  // Convert amount to USD if needed using fetched IDRX price
  const totalAmountUSD =
    currency === "IDR" ? totalAmount * idrToUsdRate : totalAmount;

  const handleClick = () => {
    if (!isConnected) {
      // Connect with first available connector (usually MetaMask or RainbowKit modal)
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
        settleInIDR,
      });
    } catch (error) {
      const parsedError = parseWeb3Error(error);
      onPaymentError?.(parsedError);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={balancesLoading || pricesLoading}
        className={`bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
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
        />
      )}
    </>
  );
}
