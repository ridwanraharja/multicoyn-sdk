export interface Token {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  chain: string;
  chainIcon?: string;
  tokenIcon?: string;
  percentage: number;
  address: `0x${string}`;
  decimals: number;
  priceUSD: number;
  isApproved?: boolean;
}

export interface PaymentItem {
  name: string;
  price: number;
}

export interface MulticoynButtonProps {
  totalAmount: number;
  currency?: string;
  items: PaymentItem[];
  tokens?: Token[];
  onPaymentComplete?: (result: PaymentResult) => void;
  onPaymentError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  currency?: string;
  items: PaymentItem[];
  tokens: Token[];
  onPaymentSubmit: () => void;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  tokens: Token[];
}
