import type { PaymentItem } from "./types";
import { getCurrencySymbol, formatNumberWithCommas } from "../lib/tokens";

interface PaymentSummaryProps {
  items: PaymentItem[];
  fee?: number;
  currency?: string;
}

export function PaymentSummary({ items, fee = 0.3, currency }: PaymentSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + fee;
  const displayCurrency = getCurrencySymbol(currency);

  return (
    <div className="bg-dark-4 rounded-md p-3 flex flex-col gap-3 w-full">
      <p className="font-medium text-base text-white">Payment Summary</p>

      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between text-xs text-white"
        >
          <span className="flex-1">{item.name}</span>
          <span className="text-right">{formatNumberWithCommas(item.price)} {displayCurrency}</span>
        </div>
      ))}

      <div className="flex items-center justify-between text-xs text-white">
        <span className="flex-1">Fee</span>
        <span className="text-right">{formatNumberWithCommas(fee)} {displayCurrency}</span>
      </div>

      <div className="h-px bg-white/20" />

      <div className="flex items-center justify-between text-white">
        <span className="text-xs">Total Payment</span>
        <span className="text-base font-semibold text-right">
          {formatNumberWithCommas(total)} {displayCurrency}
        </span>
      </div>
    </div>
  );
}
