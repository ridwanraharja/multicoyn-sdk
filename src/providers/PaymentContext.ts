import { createContext } from "react";

export interface PaymentConfig {
  merchantAddress?: `0x${string}`;
  settleInIDR?: boolean;
  enabledTokens?: string[];
  theme?: "light" | "dark";
}

export interface PaymentContextValue {
  config: PaymentConfig;
  updateConfig: (config: Partial<PaymentConfig>) => void;
}

export const PaymentContext = createContext<PaymentContextValue | undefined>(
  undefined
);
