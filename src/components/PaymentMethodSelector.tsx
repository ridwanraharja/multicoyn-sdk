import { useMemo, useState } from "react";
import type { PaymentMethodOption, PaymentTokenOption } from "../types";

export interface PaymentMethodSelectorProps {
  methods: PaymentMethodOption[];
  selectedMethod: PaymentMethodOption | null;
  onSelect: (method: PaymentMethodOption) => void;
  amount: string;
  currency: string;
  tokens?: PaymentTokenOption[];
  tokenAllocations: Record<string, number>;
  onUpdateTokenAllocation: (tokenId: string, amount: number) => void;
  hideMethods?: boolean;
}

/**
 * PaymentMethodSelector - Component for selecting payment method + multi-token allocation
 */
export function PaymentMethodSelector({
  methods,
  selectedMethod,
  onSelect,
  amount,
  currency,
  tokens = [],
  tokenAllocations,
  onUpdateTokenAllocation,
  hideMethods = false,
}: PaymentMethodSelectorProps) {
  const [search, setSearch] = useState("");

  const filteredTokens = useMemo(() => {
    if (!search.trim()) return tokens;
    const q = search.toLowerCase();
    return tokens.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.chain && t.chain.toLowerCase().includes(q))
    );
  }, [tokens, search]);

  return (
    <div className="mc:space-y-4">
      <div>
        <h2 className="mc:text-2xl mc:font-bold mc:text-gray-900">
          Select Payment Method
        </h2>
        <p className="mc:text-gray-600 mc:mt-1">
          Choose how you want to pay (supports multi-token for wallets)
        </p>
      </div>

      {/* Amount Summary */}
      <div className="mc:bg-gray-50 mc:rounded-lg mc:p-4 mc:space-y-2">
        <div className="mc:flex mc:justify-between mc:items-center">
          <span className="mc:text-gray-600">Total Required</span>
          <span className="mc:text-2xl mc:font-bold mc:text-gray-900">
            {amount} {currency}
          </span>
        </div>
      </div>

      {/* Payment Methods (optional) */}
      {!hideMethods && (
        <div className="mc:space-y-2">
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => !method.disabled && onSelect(method)}
              disabled={method.disabled}
              className={`mc:w-full mc:p-4 mc:rounded-lg mc:border-2 mc:transition-all mc:duration-200 mc:text-left ${
                selectedMethod?.id === method.id
                  ? "mc:border-blue-600 mc:bg-blue-50"
                  : "mc:border-gray-200 hover:mc:border-gray-300 mc:bg-white"
              } ${
                method.disabled
                  ? "mc:opacity-50 mc:cursor-not-allowed"
                  : "mc:cursor-pointer"
              }`}
            >
              <div className="mc:flex mc:items-center mc:justify-between">
                <div className="mc:flex mc:items-center mc:gap-3">
                  {method.icon && (
                    <div className="mc:w-10 mc:h-10 mc:flex mc:items-center mc:justify-center mc:bg-gray-100 mc:rounded-lg">
                      <span className="mc:text-xl">{method.icon}</span>
                    </div>
                  )}
                  <div>
                    <div className="mc:font-semibold mc:text-gray-900">
                      {method.name}
                    </div>
                    {method.description && (
                      <div className="mc:text-sm mc:text-gray-500 mc:mt-1">
                        {method.description}
                      </div>
                    )}
                  </div>
                </div>
                {selectedMethod?.id === method.id && (
                  <div className="mc:w-5 mc:h-5 mc:rounded-full mc:bg-blue-600 mc:flex mc:items-center mc:justify-center">
                    <svg
                      className="mc:w-3 mc:h-3 mc:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Token selector (only when wallet/crypto is chosen) */}
      {selectedMethod?.id === "wallet" || selectedMethod?.id === "crypto" ? (
        <div className="mc:space-y-3">
          <div className="mc:flex mc:items-center mc:justify-between">
            <h3 className="mc:text-lg mc:font-semibold mc:text-gray-900">
              Use your tokens
            </h3>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search token or chain..."
              className="mc:w-48 mc:border mc:border-gray-200 mc:rounded-lg mc:px-3 mc:py-2 mc:text-sm focus:mc:outline-none focus:mc:ring-2 focus:mc:ring-blue-500"
            />
          </div>

          <div className="mc:space-y-2 mc:max-h-80 mc:overflow-y-auto mc:pr-1">
            {filteredTokens.map((token) => {
              const value = tokenAllocations[token.id] ?? 0;
              return (
                <div
                  key={token.id}
                  className="mc:border mc:border-gray-200 mc:rounded-lg mc:p-3 mc:space-y-2"
                >
                  <div className="mc:flex mc:items-center mc:justify-between mc:gap-2">
                    <div className="mc:flex mc:items-center mc:gap-2">
                      {token.icon && (
                        <span className="mc:text-xl" aria-hidden>
                          {token.icon}
                        </span>
                      )}
                      <div>
                        <div className="mc:font-semibold mc:text-gray-900">
                          {token.symbol}{" "}
                          <span className="mc:text-sm mc:text-gray-500">
                            {token.name}
                          </span>
                        </div>
                        <div className="mc:text-xs mc:text-gray-500">
                          Balance: {token.balance} {token.symbol}
                        </div>
                      </div>
                    </div>
                    {token.priceUSD !== undefined && (
                      <div className="mc:text-right mc:text-xs mc:text-gray-500">
                        ~${token.priceUSD.toFixed(4)} / {token.symbol}
                      </div>
                    )}
                  </div>

                  <div className="mc:flex mc:items-center mc:gap-3">
                    <input
                      type="range"
                      min={0}
                      max={token.balance}
                      step={1 / Math.pow(10, Math.min(token.decimals, 4))}
                      value={value}
                      onChange={(e) =>
                        onUpdateTokenAllocation(
                          token.id,
                          Number(e.target.value)
                        )
                      }
                      className="mc:flex-1 mc:accent-blue-600"
                    />
                    <input
                      type="number"
                      min={0}
                      max={token.balance}
                      step={1 / Math.pow(10, Math.min(token.decimals, 4))}
                      value={value}
                      onChange={(e) =>
                        onUpdateTokenAllocation(
                          token.id,
                          Number(e.target.value)
                        )
                      }
                      className="mc:w-28 mc:border mc:border-gray-200 mc:rounded-lg mc:px-2 mc:py-1 mc:text-sm focus:mc:outline-none focus:mc:ring-2 focus:mc:ring-blue-500"
                    />
                  </div>

                  {token.priceUSD !== undefined && (
                    <div className="mc:text-xs mc:text-gray-600">
                      ≈ ${(value * token.priceUSD).toFixed(2)} USD
                    </div>
                  )}
                </div>
              );
            })}

            {filteredTokens.length === 0 && (
              <div className="mc:text-sm mc:text-gray-500 mc:text-center mc:py-4">
                No tokens found
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
