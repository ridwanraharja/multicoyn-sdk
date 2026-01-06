import type { Token } from "./types";

interface TokenSliderProps {
  token: Token;
  onChange: (percentage: number) => void;
}

export function TokenSlider({ token, onChange }: TokenSliderProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-1.5 w-full">
      <div className="flex items-center gap-3 w-[106px]">
        <div className="relative size-[30px]">
          <div className="size-[30px] rounded-full bg-dark-4 overflow-hidden flex items-center justify-center">
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
            {token.amount} {token.symbol}
          </span>
        </div>
      </div>

      <div className="flex-1 relative h-1.5">
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
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <span className="text-xs font-semibold text-white text-center w-8">
        {token.percentage}%
      </span>
    </div>
  );
}
