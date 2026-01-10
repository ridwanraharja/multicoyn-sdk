import { useContext } from "react";
import { PaymentContext } from "./PaymentContext";

export function usePaymentConfig() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePaymentConfig must be used within PaymentProvider");
  }
  return context;
}
