import { formatNumberWithCommas, getCurrencySymbol } from "../lib/tokens";
import type { Token } from "./types";

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
    <div className="mc:flex mc:items-center mc:gap-1.5 mc:sm:gap-2 mc:w-full mc:flex-wrap">
      <div className="mc:flex mc:items-center mc:gap-2 mc:sm:gap-3 mc:min-w-0 mc:flex-1 mc:sm:flex-initial">
        <div className="mc:relative mc:size-[30px] mc:shrink-0">
          <div
            className={`mc:size-[30px] mc:rounded-full mc:bg-dark-4 mc:overflow-hidden mc:flex mc:items-center mc:justify-center ${
              !hasValidPrice ? "mc:opacity-50" : ""
            }`}
          >
            {token.tokenIcon ? (
              <img
                src={token.tokenIcon}
                alt={token.name}
                className="mc:size-full mc:object-cover"
              />
            ) : (
              <span className="mc:text-xs mc:font-semibold mc:text-white">
                {token.symbol.slice(0, 2)}
              </span>
            )}
          </div>
          <div className="mc:absolute mc:right-[-2px] mc:bottom-[-2px] mc:size-[12px] mc:rounded-full mc:bg-dark-3 mc:border mc:border-dark-2 mc:overflow-hidden mc:flex mc:items-center mc:justify-center">
            {token.chainIcon ? (
              <img
                src={token.chainIcon}
                alt={token.chain}
                className="mc:size-full mc:object-cover"
              />
            ) : (
              <span className="mc:text-[6px] mc:font-semibold mc:text-white">
                {token.chain.slice(0, 1)}
              </span>
            )}
          </div>
        </div>
        <div className="mc:flex mc:flex-col mc:gap-1 mc:text-xs mc:text-white mc:min-w-0">
          <span className="mc:font-semibold mc:wrap-break-word">
            {token.name}
          </span>
          <span className="mc:font-normal mc:opacity-75 mc:wrap-break-word">
            {token.amount.toFixed(4)} {token.symbol}
          </span>
          <span
            className={`mc:text-[10px] mc:wrap-break-word ${
              hasValidPrice ? "mc:text-white/50" : "mc:text-yellow-500"
            }`}
          >
            {hasValidPrice
              ? `$${token.priceUSD.toFixed(2)}/${token.symbol}`
              : "Price loading..."}
          </span>
        </div>
      </div>

      <div
        className={`mc:flex-1 mc:relative mc:h-1.5 mc:min-w-[100px] ${
          disabled ? "mc:opacity-50" : ""
        }`}
      >
        <div className="mc:absolute mc:inset-0 mc:bg-white/40 mc:rounded-full" />
        <div
          className="mc:absolute mc:left-0 mc:top-0 mc:h-full mc:bg-secondary mc:rounded-full mc:transition-all"
          style={{ width: `${token.percentage}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={token.percentage}
          onChange={handleSliderChange}
          className={`mc:absolute mc:inset-0 mc:w-full mc:h-full mc:opacity-0 ${
            disabled ? "mc:cursor-not-allowed" : "mc:cursor-pointer"
          }`}
          disabled={disabled || token.amount === 0 || !hasValidPrice}
        />
      </div>

      <div className="mc:flex mc:flex-col mc:items-end mc:gap-0.5 mc:min-w-0 mc:w-full mc:sm:w-auto">
        <span className="mc:text-xs mc:font-semibold mc:text-white mc:text-right mc:wrap-break-word">
          {token.percentage}% = {formatNumberWithCommas(displayValue)}{" "}
          {displayCurrency}
        </span>
        {token.percentage > 0 && (
          <span
            className={`mc:text-[10px] mc:text-right mc:wrap-break-word ${
              hasEnoughBalance ? "mc:text-white/60" : "mc:text-red-500"
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
