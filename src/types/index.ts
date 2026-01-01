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

export interface PaymentTokenOption {
  id: string; // unique token id
  symbol: string; // e.g. BTC, ETH
  name: string; // token name
  balance: number; // user balance in token units (human readable)
  decimals: number; // token decimals for precise conversion
  priceUSD?: number; // optional price in USD for conversion/validation
  chain?: string; // optional chain identifier
  icon?: string; // optional icon emoji/url
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
  /** Optional list of user-owned tokens (for multi-token payments) */
  paymentTokens?: PaymentTokenOption[];
  /** Override callbacks for this specific payment */
  onComplete?: (data: PaymentResult) => void;
  onError?: (error: PaymentError) => void;
}
