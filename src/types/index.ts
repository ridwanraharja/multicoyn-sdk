/**
 * Configuration for the Payment SDK
 */
export interface PaymentConfig {
  /** API key for authentication */
  apiKey: string;
  /** Blockchain network (e.g., 'ethereum', 'polygon', 'bsc') */
  chain: string;
  /** Environment: 'production' | 'staging' | 'development' */
  environment?: "production" | "staging" | "development";
  /** Optional callback when payment is completed */
  onPaymentComplete?: (data: PaymentResult) => void;
  /** Optional callback when payment fails */
  onPaymentError?: (error: PaymentError) => void;
}

/**
 * Payment result data
 */
export interface PaymentResult {
  transactionHash?: string;
  amount: string;
  currency: string;
  status: "success" | "failed" | "pending";
  paymentMethod?: PaymentMethod;
  [key: string]: unknown;
}

/**
 * Payment error data
 */
export interface PaymentError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Payment method types
 */
export type PaymentMethod = "wallet" | "card" | "bank_transfer" | "crypto";

/**
 * Payment method option
 */
export interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  icon?: string;
  description?: string;
  disabled?: boolean;
}

/**
 * Payment modal state
 */
export type PaymentModalState = "selection" | "loading" | "success" | "error";

/**
 * Payment modal options
 */
export interface PaymentModalOptions {
  /** Amount to pay */
  amount: string;
  /** Currency code */
  currency: string;
  /** Optional recipient address */
  recipient?: string;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
  /** Available payment methods */
  paymentMethods?: PaymentMethodOption[];
  /** Override callbacks for this specific payment */
  onComplete?: (data: PaymentResult) => void;
  onError?: (error: PaymentError) => void;
}
