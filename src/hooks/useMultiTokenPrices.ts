import { TOKENS } from "../config/contracts";
import { useTokenRegistry } from "./useTokenRegistry";

export function useMultiTokenPrices() {
  const tokenRegistry = useTokenRegistry();

  // Get token prices from TokenRegistry contract
  const {
    data: ethPrice,
    isLoading: ethLoading,
    error: ethError,
  } = tokenRegistry.useGetTokenPrice(TOKENS.NATIVE);
  const {
    data: usdcPrice,
    isLoading: usdcLoading,
    error: usdcError,
  } = tokenRegistry.useGetTokenPrice(TOKENS.USDC);
  const {
    data: usdtPrice,
    isLoading: usdtLoading,
    error: usdtError,
  } = tokenRegistry.useGetTokenPrice(TOKENS.USDT);
  const {
    data: daiPrice,
    isLoading: daiLoading,
    error: daiError,
  } = tokenRegistry.useGetTokenPrice(TOKENS.DAI);
  const {
    data: wbtcPrice,
    isLoading: wbtcLoading,
    error: wbtcError,
  } = tokenRegistry.useGetTokenPrice(TOKENS.WBTC);

  const USD_SCALE = 1e8;

  const convertPrice = (priceData: unknown): number => {
    if (!priceData) return 0;
    try {
      if (Array.isArray(priceData) && priceData.length >= 1) {
        const price = priceData[0];
        if (typeof price === "bigint") {
          return Number(price) / USD_SCALE;
        }
        if (typeof price === "number") {
          return price / USD_SCALE;
        }
        if (typeof price === "string") {
          return Number(price) / USD_SCALE;
        }
      }
      if (typeof priceData === "bigint") {
        return Number(priceData) / USD_SCALE;
      }
      if (typeof priceData === "number") {
        return priceData / USD_SCALE;
      }
      return 0;
    } catch (error) {
      console.error("Error converting price:", error);
      return 0;
    }
  };

  if (ethError) console.error("ETH price error:", ethError);
  if (usdcError) console.error("USDC price error:", usdcError);
  if (usdtError) console.error("USDT price error:", usdtError);
  if (daiError) console.error("DAI price error:", daiError);
  if (wbtcError) console.error("WBTC price error:", wbtcError);

  const convertedPrices = {
    ETH: convertPrice(ethPrice),
    USDC: convertPrice(usdcPrice) || 1,
    USDT: convertPrice(usdtPrice) || 1,
    DAI: convertPrice(daiPrice) || 1,
    WBTC: convertPrice(wbtcPrice),
  };

  console.log("Converted prices:", convertedPrices);

  return {
    prices: convertedPrices,
    isLoading:
      ethLoading || usdcLoading || usdtLoading || daiLoading || wbtcLoading,
    errors: {
      ETH: ethError,
      USDC: usdcError,
      USDT: usdtError,
      DAI: daiError,
      WBTC: wbtcError,
    },
  };
}
