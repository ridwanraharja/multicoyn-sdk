import { useState } from "react";
import type { ReactNode } from "react";
import { PaymentContext } from "./PaymentContext";
import type { PaymentConfig } from "./PaymentContext";

export function PaymentProvider({
  children,
  initialConfig = {},
}: {
  children: ReactNode;
  initialConfig?: PaymentConfig;
}) {
  const [config, setConfig] = useState<PaymentConfig>(initialConfig);

  const updateConfig = (newConfig: Partial<PaymentConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <PaymentContext.Provider value={{ config, updateConfig }}>
      {children}
    </PaymentContext.Provider>
  );
}

