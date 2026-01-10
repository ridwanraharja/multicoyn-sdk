export class PaymentError extends Error {
  code: string;
  details?: unknown;

  constructor(
    message: string,
    code: string,
    details?: unknown
  ) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.details = details;
  }
}

export function parseWeb3Error(error: unknown): PaymentError {
  if (error instanceof Error) {
    // User rejected transaction
    if (error.message.includes('User rejected') || error.message.includes('User denied')) {
      return new PaymentError('Transaction cancelled by user', 'USER_REJECTED', error);
    }

    // Failed to approve
    if (error.message.includes('Failed to approve')) {
      return new PaymentError(error.message, 'APPROVAL_FAILED', error);
    }

    // Insufficient funds
    if (error.message.includes('insufficient funds')) {
      return new PaymentError(
        'Insufficient funds for gas',
        'INSUFFICIENT_FUNDS',
        error
      );
    }

    // Wallet not connected
    if (error.message.includes('Wallet not connected')) {
      return new PaymentError('Please connect your wallet', 'WALLET_NOT_CONNECTED', error);
    }

    // Network error
    if (error.message.includes('network')) {
      return new PaymentError('Network error. Please check your connection', 'NETWORK_ERROR', error);
    }

    // Contract error - insufficient payment
    if (error.message.includes('insufficient payment') || error.message.includes('PaymentRouter: insufficient')) {
      return new PaymentError('Payment amount is insufficient. This may be due to price fluctuation. Please try again.', 'INSUFFICIENT_PAYMENT', error);
    }

    // Contract error
    if (error.message.includes('execution reverted')) {
      return new PaymentError('Transaction failed. Please try again', 'CONTRACT_ERROR', error);
    }

    // Return the original error message if it's already descriptive
    if (error.message) {
      return new PaymentError(error.message, 'ERROR', error);
    }
  }

  return new PaymentError('An unknown error occurred. Please try again', 'UNKNOWN', error);
}
