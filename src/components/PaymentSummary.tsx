import type { PaymentItem } from "./types";
import { getCurrencySymbol, formatNumberWithCommas } from "../lib/tokens";

interface PaymentSummaryProps {
  items: PaymentItem[];
  fee?: number;
  currency?: string;
}

export function PaymentSummary({
  items,
  fee = 0.3,
  currency,
}: PaymentSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + fee;
  const displayCurrency = getCurrencySymbol(currency);

  return (
    <div className="mc:bg-dark-4 mc:rounded-md mc:p-3 mc:flex mc:flex-col mc:gap-3 mc:w-full">
      <p className="mc:font-medium mc:text-base mc:text-white">
        Payment Summary
      </p>

      {items.map((item, index) => (
        <div
          key={index}
          className="mc:flex mc:items-center mc:justify-between mc:text-xs mc:text-white"
        >
          <span className="mc:flex-1">{item.name}</span>
          <span className="mc:text-right">
            {formatNumberWithCommas(item.price)} {displayCurrency}
          </span>
        </div>
      ))}

      <div className="mc:flex mc:items-center mc:justify-between mc:text-xs mc:text-white">
        <span className="mc:flex-1">Fee</span>
        <span className="mc:text-right">
          {formatNumberWithCommas(fee)} {displayCurrency}
        </span>
      </div>

      <div className="mc:h-px mc:bg-white/20" />

      <div className="mc:flex mc:items-center mc:justify-between mc:text-white">
        <span className="mc:text-xs">Total Payment</span>
        <span className="mc:text-base mc:font-semibold mc:text-right">
          {formatNumberWithCommas(total)} {displayCurrency}
        </span>
      </div>
    </div>
  );
}
