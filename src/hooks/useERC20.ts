import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { ERC20_ABI } from '../config/abis';

export function useERC20(tokenAddress: `0x${string}`) {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Read functions
  const useName = () => {
    return useReadContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'name',
    });
  };

  const useSymbol = () => {
    return useReadContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'symbol',
    });
  };

  const useDecimals = () => {
    return useReadContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'decimals',
    });
  };

  const useTotalSupply = () => {
    return useReadContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'totalSupply',
    });
  };

  const useBalanceOf = (account?: `0x${string}`) => {
    const targetAccount = account || address;
    return useReadContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: targetAccount ? [targetAccount] : undefined,
      query: { enabled: !!targetAccount },
    });
  };

  const useAllowance = (owner?: `0x${string}`, spender?: `0x${string}`) => {
    return useReadContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: owner && spender ? [owner, spender] : undefined,
      query: { enabled: !!(owner && spender) },
    });
  };

  // Write functions
  const transfer = (to: `0x${string}`, amount: bigint) => {
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [to, amount],
    });
  };

  const approve = (spender: `0x${string}`, amount: bigint) => {
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spender, amount],
    });
  };

  const transferFrom = (from: `0x${string}`, to: `0x${string}`, amount: bigint) => {
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'transferFrom',
      args: [from, to, amount],
    });
  };

  return {
    // Write functions
    transfer,
    approve,
    transferFrom,

    // Read hooks
    useName,
    useSymbol,
    useDecimals,
    useTotalSupply,
    useBalanceOf,
    useAllowance,

    // Transaction state
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}
