import { MulticoynButton } from "./components";
import type { PaymentResult } from "./components";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  const handlePaymentComplete = (result: PaymentResult) => {
    console.log("Payment completed:", result);
    alert(`Payment successful! Transaction ID: ${result.transactionId}`);
  };

  const handlePaymentError = (error: Error) => {
    console.error("Payment error:", error);
    alert(`Payment failed: ${error.message}`);
  };

  return (
    <div className="min-h-screen bg-dark-1 flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 right-4">
        <ConnectButton />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          MultiCoyn SDK Demo
        </h1>
        <p className="text-white/70 mb-2">
          Test multi-token payment with real blockchain transactions
        </p>
        <p className="text-white/50 text-sm">Network: Lisk Sepolia Testnet</p>
      </div>

      <MulticoynButton
        totalAmount={1000000}
        merchantAddress="0x740F4ffd755Be5888aD1260609510dc1da0445C9"
        currency="USD"
        items={[{ name: "Test Product", price: 1000000 }]}
        onPaymentComplete={handlePaymentComplete}
        onPaymentError={handlePaymentError}
      />

      <div className="mt-8 text-white/40 text-xs text-center">
        <p>Need test tokens?</p>
        <a
          href="https://sepolia-faucet.lisk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan hover:underline"
        >
          Get from Lisk Sepolia Faucet
        </a>
      </div>
    </div>
  );
}

export default App;
