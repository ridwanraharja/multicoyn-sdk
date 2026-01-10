import type { Token } from "./types";
import { getCurrencySymbol, formatNumberWithCommas } from "../lib/tokens";

interface TokenSliderProps {
  token: Token;
  onChange: (percentage: number) => void;
  totalAmount: number; // USD amount for calculating token needed
  displayAmount?: number; // Original amount for display
  currency?: string;
  disabled?: boolean;
}

export function TokenSlider({
  token,
  onChange,
  totalAmount,
  displayAmount,
  currency,
  disabled = false,
}: TokenSliderProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const usdValue = (totalAmount * token.percentage) / 100;
  const tokenAmountNeeded = token.priceUSD > 0 ? usdValue / token.priceUSD : 0;
  const hasEnoughBalance = tokenAmountNeeded <= token.amount;
  const hasValidPrice = token.priceUSD > 0;
  const displayCurrency = getCurrencySymbol(currency);

  const amountToShow = displayAmount ?? totalAmount;
  const displayValue = (amountToShow * token.percentage) / 100;

  return (
    <div className="flex items-center gap-1.5 w-full">
      <div className="flex items-center gap-3 w-35">
        <div className="relative size-[30px]">
          <div
            className={`size-[30px] rounded-full bg-dark-4 overflow-hidden flex items-center justify-center ${
              !hasValidPrice ? "opacity-50" : ""
            }`}
          >
            {token.tokenIcon ? (
              <img
                src={token.tokenIcon}
                alt={token.name}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-xs font-semibold text-white">
                {token.symbol.slice(0, 2)}
              </span>
            )}
          </div>
          <div className="absolute right-[-2px] bottom-[-2px] size-[12px] rounded-full bg-dark-3 border border-dark-2 overflow-hidden flex items-center justify-center">
            {token.chainIcon ? (
              <img
                src={token.chainIcon}
                alt={token.chain}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-[6px] font-semibold text-white">
                {token.chain.slice(0, 1)}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs text-white">
          <span className="font-semibold">{token.name}</span>
          <span className="font-normal opacity-75">
            {token.amount.toFixed(4)} {token.symbol}
          </span>
          <span
            className={`text-[10px] ${
              hasValidPrice ? "text-white/50" : "text-yellow-500"
            }`}
          >
            {hasValidPrice
              ? `$${token.priceUSD.toFixed(2)}/${token.symbol}`
              : "Price loading..."}
          </span>
        </div>
      </div>

      <div className={`flex-1 relative h-1.5 ${disabled ? 'opacity-50' : ''}`}>
        <div className="absolute inset-0 bg-white/40 rounded-full" />
        <div
          className="absolute left-0 top-0 h-full bg-secondary rounded-full transition-all"
          style={{ width: `${token.percentage}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={token.percentage}
          onChange={handleSliderChange}
          className={`absolute inset-0 w-full h-full opacity-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          disabled={disabled || token.amount === 0 || !hasValidPrice}
        />
      </div>

      <div className="flex flex-col items-end gap-0.5 min-w-25">
        <span className="text-xs font-semibold text-white">
          {token.percentage}% = {formatNumberWithCommas(displayValue)} {displayCurrency}
        </span>
        {token.percentage > 0 && (
          <span
            className={`text-[10px] ${
              hasEnoughBalance ? "text-white/60" : "text-red-500"
            }`}
          >
            {formatNumberWithCommas(tokenAmountNeeded, 4)} {token.symbol}
            {!hasEnoughBalance && " ⚠️"}
          </span>
        )}
      </div>
    </div>
  );
}
