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
      <p className="mc:font-medium mc:text-sm mc:sm:text-base mc:text-white mc:break-words">
        Payment Summary
      </p>

      {items.map((item, index) => (
        <div
          key={index}
          className="mc:flex mc:items-center mc:justify-between mc:text-xs mc:text-white mc:gap-2"
        >
          <span className="mc:flex-1 mc:min-w-0 mc:break-words">{item.name}</span>
          <span className="mc:text-right mc:flex-shrink-0">
            {formatNumberWithCommas(item.price)} {displayCurrency}
          </span>
        </div>
      ))}

      <div className="mc:flex mc:items-center mc:justify-between mc:text-xs mc:text-white mc:gap-2">
        <span className="mc:flex-1">Fee</span>
        <span className="mc:text-right mc:flex-shrink-0">
          {formatNumberWithCommas(fee)} {displayCurrency}
        </span>
      </div>

      <div className="mc:h-px mc:bg-white/20" />

      <div className="mc:flex mc:items-center mc:justify-between mc:text-white mc:gap-2">
        <span className="mc:text-xs">Total Payment</span>
        <span className="mc:text-sm mc:sm:text-base mc:font-semibold mc:text-right mc:break-words">
          {formatNumberWithCommas(total)} {displayCurrency}
        </span>
      </div>
    </div>
  );
}
