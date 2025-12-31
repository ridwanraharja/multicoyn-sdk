import type { PaymentMethodOption } from "../types";

export interface PaymentMethodSelectorProps {
  methods: PaymentMethodOption[];
  selectedMethod: PaymentMethodOption | null;
  onSelect: (method: PaymentMethodOption) => void;
  amount: string;
  currency: string;
}

/**
 * PaymentMethodSelector - Component for selecting payment method
 */
export function PaymentMethodSelector({
  methods,
  selectedMethod,
  onSelect,
  amount,
  currency,
}: PaymentMethodSelectorProps) {
  return (
    <div className="mc:space-y-4">
      <div>
        <h2 className="mc:text-2xl mc:font-bold mc:text-gray-900">
          Select Payment Method
        </h2>
        <p className="mc:text-gray-600 mc:mt-1">Choose how you want to pay</p>
      </div>

      {/* Amount Summary */}
      <div className="mc:bg-gray-50 mc:rounded-lg mc:p-4">
        <div className="mc:flex mc:justify-between mc:items-center">
          <span className="mc:text-gray-600">Total Amount</span>
          <span className="mc:text-2xl mc:font-bold mc:text-gray-900">
            {amount} {currency}
          </span>
        </div>
      </div>

      {/* Payment Methods */}
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
    </div>
  );
}
