import type { PaymentResult } from "../types";

export interface SuccessStateProps {
  result: PaymentResult;
  onClose: () => void;
}

/**
 * SuccessState - Component for successful payment state
 */
export function SuccessState({ result, onClose }: SuccessStateProps) {
  return (
    <div className="mc:flex mc:flex-col mc:items-center mc:justify-center mc:py-8 mc:space-y-4">
      {/* Success Icon */}
      <div className="mc:w-16 mc:h-16 mc:bg-green-500/20 mc:rounded-full mc:flex mc:items-center mc:justify-center">
        <svg
          className="mc:w-10 mc:h-10 mc:text-green-400"
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

      {/* Success Message */}
      <div className="mc:text-center">
        <h3 className="mc:text-2xl mc:font-bold mc:text-white mc:mb-2">
          Payment Successful!
        </h3>
        <p className="mc:text-gray-400">
          Your payment has been processed successfully
        </p>
      </div>

      {/* Transaction Details */}
      <div className="mc:w-full mc:bg-white/5 mc:rounded-lg mc:p-4 mc:space-y-2">
        <div className="mc:flex mc:justify-between">
          <span className="mc:text-gray-400">Amount:</span>
          <span className="mc:font-semibold mc:text-white">
            {result.amount} {result.currency}
          </span>
        </div>
        {result.transactionHash && (
          <div className="mc:flex mc:justify-between mc:items-start">
            <span className="mc:text-gray-400">Transaction:</span>
            <span className="mc:font-mono mc:text-sm mc:text-white mc:text-right mc:break-all">
              {result.transactionHash}
            </span>
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="mc:w-full mc:bg-purple-600 hover:mc:bg-purple-700 mc:text-white mc:font-semibold mc:py-3 mc:px-4 mc:rounded-lg mc:transition-colors mc:duration-200 mc:mt-4"
      >
        Close
      </button>
    </div>
  );
}
