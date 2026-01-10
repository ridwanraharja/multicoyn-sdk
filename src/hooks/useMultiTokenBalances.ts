import { useAccount, useBalance } from 'wagmi';
import { TOKENS } from '../config/contracts';
import { useERC20 } from './useERC20';
import { formatUnits } from 'viem';

export function useMultiTokenBalances() {
  const { address } = useAccount();

  // Native ETH balance
  const { data: ethBalance, isLoading: ethLoading } = useBalance({
    address,
  });

  // ERC20 balances using useERC20 hook
  const usdcHook = useERC20(TOKENS.USDC);
  const usdtHook = useERC20(TOKENS.USDT);
  const daiHook = useERC20(TOKENS.DAI);
  const wbtcHook = useERC20(TOKENS.WBTC);

  const { data: usdcBalance, isLoading: usdcLoading } = usdcHook.useBalanceOf(address);
  const { data: usdtBalance, isLoading: usdtLoading } = usdtHook.useBalanceOf(address);
  const { data: daiBalance, isLoading: daiLoading } = daiHook.useBalanceOf(address);
  const { data: wbtcBalance, isLoading: wbtcLoading } = wbtcHook.useBalanceOf(address);

  return {
    balances: {
      ETH: ethBalance ? parseFloat(formatUnits(ethBalance.value, 18)) : 0,
      USDC: usdcBalance ? parseFloat(formatUnits(usdcBalance as bigint, 6)) : 0,
      USDT: usdtBalance ? parseFloat(formatUnits(usdtBalance as bigint, 6)) : 0,
      DAI: daiBalance ? parseFloat(formatUnits(daiBalance as bigint, 18)) : 0,
      WBTC: wbtcBalance ? parseFloat(formatUnits(wbtcBalance as bigint, 8)) : 0,
    },
    isLoading: !address || ethLoading || usdcLoading || usdtLoading || daiLoading || wbtcLoading,
  };
}
