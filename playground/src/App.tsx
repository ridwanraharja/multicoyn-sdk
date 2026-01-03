import {
  PaymentProvider,
  type PaymentError,
  type PaymentResult,
} from "multicoyn-sdk";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// Import playground Tailwind styles
import "./index.css";
// Import SDK styles for modal
import "../../src/styles/tailwind.css";

import ExamplePage from "./pages/Example";
import LandingPage from "./pages/LandingPage";
import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
  return (
    <PaymentProvider
      config={{
        apiKey: "test-api-key-12345",
        chain: "ethereum",
        environment: "development",
        onPaymentComplete: (result: PaymentResult) => {
          console.log("Global payment complete:", result);
        },
        onPaymentError: (error: PaymentError) => {
          console.error("Global payment error:", error);
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/example" element={<ExamplePage />} />
        </Routes>
      </Router>
    </PaymentProvider>
  );
}

export default App;
