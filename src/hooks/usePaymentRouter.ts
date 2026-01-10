import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
  useConfig,
} from "wagmi";
import { parseUnits, maxUint256 } from "viem";
import { readContract } from "@wagmi/core";
import { CONTRACTS } from "../config/contracts";
import { PAYMENT_ROUTER_ABI, ERC20_ABI } from "../config/abis";
import { USD_SCALE } from "../constants/payment";

interface Token {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  priceUSD: number;
  percentage: number;
  amount: number;
}

interface PaymentParams {
  merchantAddress: `0x${string}`;
  tokens: Token[];
  totalAmountUSD: number;
  settleInIDR: boolean;
}

export function usePaymentRouter() {
  const { address } = useAccount();
  const config = useConfig();
  const {
    writeContractAsync,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Read functions
  const useTokenRegistry = () => {
    return useReadContract({
      address: CONTRACTS.PAYMENT_ROUTER,
      abi: PAYMENT_ROUTER_ABI,
      functionName: "tokenRegistry",
    });
  };

  const useFeePercentage = () => {
    return useReadContract({
      address: CONTRACTS.PAYMENT_ROUTER,
      abi: PAYMENT_ROUTER_ABI,
      functionName: "feePercentage",
    });
  };

  const usePaused = () => {
    return useReadContract({
      address: CONTRACTS.PAYMENT_ROUTER,
      abi: PAYMENT_ROUTER_ABI,
      functionName: "paused",
    });
  };

  const checkAllowance = async (
    tokenAddress: `0x${string}`,
    owner: `0x${string}`
  ): Promise<bigint> => {
    try {
      const allowance = await readContract(config, {
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [owner, CONTRACTS.PAYMENT_ROUTER],
      });

      return allowance as bigint;
    } catch (error) {
      console.error("Error checking allowance:", error);
      return BigInt(0);
    }
  };

  const approveToken = async (tokenAddress: `0x${string}`, amount: bigint) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    if (tokenAddress === "0x0000000000000000000000000000000000000000") {
      return null;
    }

    try {
      const currentAllowance = await checkAllowance(tokenAddress, address);

      if (currentAllowance >= amount) {
        console.log(
          `Sufficient allowance for ${tokenAddress}, skipping approval`
        );
        return null;
      }

      console.log(`Requesting infinite approval for ${tokenAddress}`);
      return await writeContractAsync({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [CONTRACTS.PAYMENT_ROUTER, maxUint256],
      });
    } catch (error) {
      console.error(`Error in approveToken for ${tokenAddress}:`, error);
      throw error;
    }
  };

  // Write functions
  const executePayment = async ({
    merchantAddress,
    tokens,
    totalAmountUSD,
    settleInIDR,
  }: PaymentParams) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    const activeTokens = tokens.filter((t) => t.percentage > 0);
    const tokenAddresses: `0x${string}`[] = [];
    const amounts: bigint[] = [];
    let nativeValue = BigInt(0);

    const feeAmount = totalAmountUSD * 0.003;
    const totalWithFee = totalAmountUSD + feeAmount;

    for (const token of activeTokens) {
      if (!token.priceUSD || token.priceUSD <= 0) {
        throw new Error(
          `Invalid price for ${token.symbol}. Price data may not be available yet. Please wait a moment and try again.`
        );
      }

      const usdValue = (totalWithFee * token.percentage) / 100;

      const tokenAmount = usdValue / token.priceUSD;

      if (!isFinite(tokenAmount) || tokenAmount <= 0) {
        throw new Error(`Invalid amount calculated for ${token.symbol}`);
      }

      const maxPrecision = Math.min(token.decimals + 2, 18);
      const formattedAmount = tokenAmount.toFixed(maxPrecision);

      let amount = parseUnits(formattedAmount, token.decimals);

      amount = amount + BigInt(1);

      if (token.address === "0x0000000000000000000000000000000000000000") {
        nativeValue = amount;
        tokenAddresses.push(token.address);
        amounts.push(amount);
      } else {
        tokenAddresses.push(token.address);
        amounts.push(amount);
      }
    }

    for (let i = 0; i < activeTokens.length; i++) {
      const token = activeTokens[i];
      if (token.address !== "0x0000000000000000000000000000000000000000") {
        try {
          const result = await approveToken(token.address, amounts[i]);
          if (result) {
            console.log(`Approved infinite allowance for ${token.symbol}`);
          }
        } catch (error) {
          throw new Error(`Failed to approve ${token.symbol}: ${error}`);
        }
      }
    }

    const productPriceUSD = BigInt(Math.floor(totalAmountUSD * USD_SCALE));

    return await writeContractAsync({
      address: CONTRACTS.PAYMENT_ROUTER,
      abi: PAYMENT_ROUTER_ABI,
      functionName: "pay",
      args: [
        merchantAddress,
        tokenAddresses,
        amounts,
        productPriceUSD,
        settleInIDR,
      ],
      value: nativeValue,
    });
  };

  return {
    // Write functions
    executePayment,

    // Read hooks
    useTokenRegistry,
    useFeePercentage,
    usePaused,

    // Transaction state
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}
