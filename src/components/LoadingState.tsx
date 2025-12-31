export interface LoadingStateProps {
  message?: string;
}

/**
 * LoadingState - Component for payment processing state
 */
export function LoadingState({
  message = "Processing payment...",
}: LoadingStateProps) {
  return (
    <div className="mc:flex mc:flex-col mc:items-center mc:justify-center mc:py-8 mc:space-y-4">
      {/* Spinner */}
      <div className="mc:relative mc:w-16 mc:h-16">
        <div className="mc:absolute mc:inset-0 mc:border-4 mc:border-blue-200 mc:rounded-full"></div>
        <div className="mc:absolute mc:inset-0 mc:border-4 mc:border-blue-600 mc:rounded-full mc:border-t-transparent mc:animate-spin"></div>
      </div>

      {/* Message */}
      <div className="mc:text-center">
        <p className="mc:text-lg mc:font-semibold mc:text-gray-900">
          {message}
        </p>
        <p className="mc:text-sm mc:text-gray-500 mc:mt-2">
          Please wait while we process your payment
        </p>
      </div>

      {/* Progress dots */}
      <div className="mc:flex mc:gap-2 mc:mt-4">
        <div
          className="mc:w-2 mc:h-2 mc:bg-blue-600 mc:rounded-full mc:animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="mc:w-2 mc:h-2 mc:bg-blue-600 mc:rounded-full mc:animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="mc:w-2 mc:h-2 mc:bg-blue-600 mc:rounded-full mc:animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
}
