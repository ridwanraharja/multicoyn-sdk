import {
  closePayment,
  openPayment,
  type PaymentError,
  type PaymentResult,
} from "multicoyn-sdk";
import { useState } from "react";
import { Link } from "react-router-dom";

const MOCK_PAYMENT_TOKENS = [
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
];

const ExamplePage = () => {
  const [chain, setChain] = useState("ethereum");
  const [environment, setEnvironment] = useState<
    "production" | "staging" | "development"
  >("development");

  const handleOpenPayment = () => {
    openPayment({
      amount: "100",
      currency: "USDT",
      recipient: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      paymentTokens: MOCK_PAYMENT_TOKENS,
      metadata: {
        orderId: "12345",
        description: "Test payment from Example page",
      },
      onComplete: (result: PaymentResult) => {
        console.log("Payment completed:", result);
      },
      onError: (error: PaymentError) => {
        console.error("Payment error:", error);
        alert(`Payment failed: ${error.message}`);
      },
    });
  };

  const handleClosePayment = () => {
    closePayment();
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            MultiCoin SDK - Playground
          </h1>
          <p className="text-gray-400">
            Test the SDK locally before publishing to npm.
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Configuration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Blockchain Network
              </label>
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="bsc">BSC</option>
                <option value="arbitrum">Arbitrum</option>
                <option value="optimism">Optimism</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Environment
              </label>
              <select
                value={environment}
                onChange={(e) =>
                  setEnvironment(e.target.value as typeof environment)
                }
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-300">
              <span className="font-medium">Current Config:</span> Chain:{" "}
              <code className="bg-gray-600 px-1 rounded">{chain}</code> |
              Environment:{" "}
              <code className="bg-gray-600 px-1 rounded">{environment}</code>
            </p>
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Test Payment Modal
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleOpenPayment}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Open Payment Modal
            </button>
            <button
              onClick={handleClosePayment}
              className="px-6 py-3 bg-gray-700 text-gray-300 font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close Modal
            </button>
          </div>
        </div>

        {/* Testing Checklist */}
        <div className="bg-purple-500/10 rounded-2xl border border-purple-500/30 p-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">
            Testing Checklist
          </h3>
          <ul className="space-y-2 text-purple-200">
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Modal opens when clicking "Open Payment Modal"
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Payment token selection screen appears
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Can select payment token
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              "Continue Payment" button enables after selection
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Loading state appears after clicking continue
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Success state appears after payment completes
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Modal closes from success state
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Modal closes when clicking backdrop (selection only)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Modal closes on Escape key (selection only)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Tailwind classes are prefixed with "mc:"
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              No CSS conflicts with playground styles
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Portal renders to document.body
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Callbacks are called correctly
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            ← Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamplePage;
