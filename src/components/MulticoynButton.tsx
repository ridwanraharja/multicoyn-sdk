import { useState } from "react";
import { PaymentModal } from "./PaymentModal";
import type { Token, PaymentItem, PaymentResult } from "./types";

interface MulticoynButtonProps {
  totalAmount: number;
  currency?: string;
  items: PaymentItem[];
  tokens?: Token[];
  onPaymentComplete?: (result: PaymentResult) => void;
  onPaymentError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
}

const defaultTokens: Token[] = [
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    amount: 0.2,
    chain: "Solana",
    percentage: 15,
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    amount: 0.04,
    chain: "Ethereum",
    percentage: 65,
  },
  {
    id: "doge",
    name: "DogeCoin",
    symbol: "DOGE",
    amount: 13,
    chain: "Dogecoin",
    percentage: 0,
  },
  {
    id: "manta",
    name: "Manta",
    symbol: "MANTA",
    amount: 2,
    chain: "Manta",
    percentage: 20,
  },
];

export function MulticoynButton({
  totalAmount,
  currency = "USDT",
  items,
  tokens = defaultTokens,
  onPaymentComplete,
  onPaymentError,
  className = "",
  children,
}: MulticoynButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePaymentSubmit = (selectedTokens: Token[]) => {
    try {
      // Here you would integrate with actual payment processing
      const result: PaymentResult = {
        success: true,
        transactionId: `tx_${Date.now()}`,
        tokens: selectedTokens,
      };
      onPaymentComplete?.(result);
      setIsModalOpen(false);
    } catch (error) {
      onPaymentError?.(error as Error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all ${className}`}
      >
        {children || "Pay with MultiCoyn"}
      </button>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalAmount={totalAmount}
        currency={currency}
        items={items}
        tokens={tokens}
        onPaymentSubmit={handlePaymentSubmit}
      />
    </>
  );
}
