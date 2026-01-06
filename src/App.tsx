import { MulticoynButton } from "./components";
import type { PaymentResult } from "./components";

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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          MultiCoyn SDK Demo
        </h1>
        <p className="text-white/70">
          Click the button below to open the payment modal
        </p>
      </div>

      <MulticoynButton
        totalAmount={100}
        currency="USDT"
        items={[{ name: "ByteApe #001 The Architect", price: 100 }]}
        onPaymentComplete={handlePaymentComplete}
        onPaymentError={handlePaymentError}
      />
    </div>
  );
}

export default App;
