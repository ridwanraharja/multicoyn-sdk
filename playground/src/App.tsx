import { PaymentProvider, closePayment, openPayment } from "multicoyn-sdk";
// Import SDK styles directly from source (works with Vite alias)
import { useState } from "react";
import "../../src/styles/tailwind.css";

function App() {
  const [apiKey] = useState("test-api-key-12345");
  const [chain, setChain] = useState("ethereum");
  const [environment, setEnvironment] = useState<
    "production" | "staging" | "development"
  >("development");

  const handleOpenPayment = () => {
    openPayment({
      amount: "100",
      currency: "USDT",
      recipient: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      paymentTokens: [
        {
          id: "btc",
          symbol: "BTC",
          name: "Bitcoin",
          balance: 0.12345678,
          decimals: 8,
          priceUSD: 60000,
          icon: "₿",
        },
        {
          id: "eth",
          symbol: "ETH",
          name: "Ethereum",
          balance: 3.214,
          decimals: 18,
          priceUSD: 3200,
          icon: "Ξ",
        },
        {
          id: "usdc",
          symbol: "USDC",
          name: "USD Coin",
          balance: 500,
          decimals: 6,
          priceUSD: 1,
          icon: "💲",
        },
        {
          id: "matic",
          symbol: "MATIC",
          name: "Polygon",
          balance: 1200,
          decimals: 18,
          priceUSD: 0.75,
          icon: "🟣",
        },
      ],
      metadata: {
        orderId: "12345",
        description: "Test payment",
      },
      onComplete: (result) => {
        console.log("Payment completed:", result);
        // Alert will be shown by the success state in modal
      },
      onError: (error) => {
        console.error("Payment error:", error);
        alert(`Payment failed: ${error.message}`);
      },
    });
  };

  return (
    <PaymentProvider
      config={{
        apiKey,
        chain,
        environment,
        onPaymentComplete: (result) => {
          console.log("Global payment complete:", result);
        },
        onPaymentError: (error) => {
          console.error("Global payment error:", error);
        },
      }}
    >
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1>MultiCoin SDK - Playground</h1>
        <p>This is a playground to test the SDK locally before publishing.</p>

        <div
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            background: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <h2>Configuration</h2>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Chain:
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                style={{ marginLeft: "0.5rem", padding: "0.25rem" }}
              >
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="bsc">BSC</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Environment:
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as any)}
                style={{ marginLeft: "0.5rem", padding: "0.25rem" }}
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </label>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h2>Test Payment Modal</h2>
          <button
            onClick={handleOpenPayment}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Open Payment Modal
          </button>
          <button
            onClick={closePayment}
            style={{
              marginLeft: "1rem",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Close Modal
          </button>
        </div>

        <div
          style={{
            padding: "1rem",
            background: "#e7f3ff",
            borderRadius: "8px",
          }}
        >
          <h3>Testing Checklist</h3>
          <ul>
            <li>✓ Modal opens when clicking "Open Payment Modal"</li>
            <li>✓ Payment method selection screen appears</li>
            <li>✓ Can select payment method</li>
            <li>✓ "Continue Payment" button enables after selection</li>
            <li>✓ Loading state appears after clicking continue</li>
            <li>✓ Success state appears after payment completes</li>
            <li>✓ Modal closes from success state</li>
            <li>✓ Modal closes when clicking backdrop (selection only)</li>
            <li>✓ Modal closes on Escape key (selection only)</li>
            <li>✓ Tailwind classes are prefixed with "mc:"</li>
            <li>✓ No CSS conflicts with playground styles</li>
            <li>✓ Portal renders to document.body</li>
            <li>✓ Callbacks are called correctly</li>
          </ul>
        </div>
      </div>
    </PaymentProvider>
  );
}

export default App;
