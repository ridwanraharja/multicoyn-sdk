import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { CONTRACTS } from "../config/contracts";
import { TOKEN_REGISTRY_ABI } from "../config/abis";

export function useTokenRegistry() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Read functions
  const useGetTokenConfig = (tokenAddress: `0x${string}`) => {
    return useReadContract({
      address: CONTRACTS.TOKEN_REGISTRY,
      abi: TOKEN_REGISTRY_ABI,
      functionName: "getTokenConfig",
      args: [tokenAddress],
    });
  };

  const useGetTokenPrice = (tokenAddress: `0x${string}`) => {
    return useReadContract({
      address: CONTRACTS.TOKEN_REGISTRY,
      abi: TOKEN_REGISTRY_ABI,
      functionName: "getTokenPriceUSD",
      args: [tokenAddress],
    });
  };

  const useGetRegisteredTokens = () => {
    return useReadContract({
      address: CONTRACTS.TOKEN_REGISTRY,
      abi: TOKEN_REGISTRY_ABI,
      functionName: "getRegisteredTokens",
    });
  };

  const useGetRegisteredTokenCount = () => {
    return useReadContract({
      address: CONTRACTS.TOKEN_REGISTRY,
      abi: TOKEN_REGISTRY_ABI,
      functionName: "getRegisteredTokenCount",
    });
  };

  const useIsTokenEnabled = (tokenAddress: `0x${string}`) => {
    return useReadContract({
      address: CONTRACTS.TOKEN_REGISTRY,
      abi: TOKEN_REGISTRY_ABI,
      functionName: "isTokenEnabled",
      args: [tokenAddress],
    });
  };

  const useHasRole = (role: `0x${string}`, account: `0x${string}`) => {
    return useReadContract({
      address: CONTRACTS.TOKEN_REGISTRY,
      abi: TOKEN_REGISTRY_ABI,
      functionName: "hasRole",
      args: [role, account],
    });
  };

  // Write functions
  const registerToken = (
    tokenAddress: `0x${string}`,
    chainlinkFeed: `0x${string}`,
    symbol: string,
    decimals: number
  ) => {
    writeContract({
      address: CONTRACTS.TOKEN_REGISTRY,
      abi: TOKEN_REGISTRY_ABI,
      functionName: "registerToken",
      args: [tokenAddress, chainlinkFeed, symbol, decimals],
    });
  };

  const setTokenEnabled = (tokenAddress: `0x${string}`, enabled: boolean) => {
    writeContract({
      address: CONTRACTS.TOKEN_REGISTRY,
      abi: TOKEN_REGISTRY_ABI,
      functionName: "setTokenEnabled",
      args: [tokenAddress, enabled],
    });
  };

  const updatePriceFeed = (
    tokenAddress: `0x${string}`,
    newPriceFeed: `0x${string}`
  ) => {
    writeContract({
      address: CONTRACTS.TOKEN_REGISTRY,
      abi: TOKEN_REGISTRY_ABI,
      functionName: "updatePriceFeed",
      args: [tokenAddress, newPriceFeed],
    });
  };

  const setMinPaymentAmount = (
    tokenAddress: `0x${string}`,
    minAmount: bigint
  ) => {
    writeContract({
      address: CONTRACTS.TOKEN_REGISTRY,
      abi: TOKEN_REGISTRY_ABI,
      functionName: "setMinPaymentAmount",
      args: [tokenAddress, minAmount],
    });
  };

  const grantRole = (role: `0x${string}`, account: `0x${string}`) => {
    writeContract({
      address: CONTRACTS.TOKEN_REGISTRY,
      abi: TOKEN_REGISTRY_ABI,
      functionName: "grantRole",
      args: [role, account],
    });
  };

  const revokeRole = (role: `0x${string}`, account: `0x${string}`) => {
    writeContract({
      address: CONTRACTS.TOKEN_REGISTRY,
      abi: TOKEN_REGISTRY_ABI,
      functionName: "revokeRole",
      args: [role, account],
    });
  };

  return {
    // Write functions
    registerToken,
    setTokenEnabled,
    updatePriceFeed,
    setMinPaymentAmount,
    grantRole,
    revokeRole,

    // Read hooks
    useGetTokenConfig,
    useGetTokenPrice,
    useGetRegisteredTokens,
    useGetRegisteredTokenCount,
    useIsTokenEnabled,
    useHasRole,

    // Transaction state
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}
