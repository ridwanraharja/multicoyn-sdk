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
    <div className="mc:min-h-screen mc:bg-dark-1 mc:flex mc:flex-col mc:items-center mc:justify-center mc:p-8">
      <div className="mc:absolute mc:top-4 mc:right-4">
        <ConnectButton />
      </div>

      <div className="mc:text-center mc:mb-8">
        <h1 className="mc:text-3xl mc:font-bold mc:text-white mc:mb-2">
          MultiCoyn SDK Demo
        </h1>
        <p className="mc:text-white/70 mc:mb-2">
          Test multi-token payment with real blockchain transactions
        </p>
        <p className="mc:text-white/50 mc:text-sm">Network: Lisk Sepolia Testnet</p>
      </div>

      <MulticoynButton
        merchantAddress="0x740F4ffd755Be5888aD1260609510dc1da0445C9"
        items={[{ name: "Test Product", price: 1000000 }]}
        config={{ currency: "IDR" }}
        onPaymentComplete={handlePaymentComplete}
        onPaymentError={handlePaymentError}
      />

      <div className="mc:mt-8 mc:text-white/40 mc:text-xs mc:text-center">
        <p>Need test tokens?</p>
        <a
          href="https://sepolia-faucet.lisk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mc:text-cyan mc:hover:underline"
        >
          Get from Lisk Sepolia Faucet
        </a>
      </div>
    </div>
  );
}

export default App;
