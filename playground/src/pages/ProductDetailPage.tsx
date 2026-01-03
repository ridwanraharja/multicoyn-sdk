import { openPayment } from "multicoyn-sdk";
import { Link, useNavigate, useParams } from "react-router-dom";

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

interface Product {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  description: string;
  image: string;
  category: string;
  owner: string;
}

const PRODUCTS: Record<string, Product> = {
  "1": {
    id: "1",
    name: "Cosmic Dreamer NFT",
    price: "$50",
    priceValue: 50,
    description:
      "A stunning digital artwork capturing the essence of cosmic dreams. This unique NFT features vibrant colors and ethereal imagery that transports you to another dimension.",
    image: "/product-1.png",
    category: "NFT",
    owner: "0x1234...5678",
  },
  "2": {
    id: "2",
    name: "Pixel Warriors Pack",
    price: "$75",
    priceValue: 75,
    description:
      "An exclusive pack of pixel art warriors for your blockchain game collection. Includes 5 unique characters with special abilities.",
    image: "/product-2.png",
    category: "Game",
    owner: "0xABCD...EFGH",
  },
  "3": {
    id: "3",
    name: "DeFi Starter Bundle",
    price: "$100",
    priceValue: 100,
    description:
      "Everything you need to get started with DeFi. Includes governance tokens, staking rewards, and exclusive access to new protocols.",
    image: "/product-3.png",
    category: "DeFi",
    owner: "0x9876...5432",
  },
  "4": {
    id: "4",
    name: "Rare Collectible #42",
    price: "$125",
    priceValue: 125,
    description:
      "One of only 100 rare collectibles in existence. Features hand-drawn artwork and comes with exclusive holder benefits.",
    image: "/product-4.png",
    category: "NFT",
    owner: "0xDEAD...BEEF",
  },
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = PRODUCTS[id || "1"] || PRODUCTS["1"];

  const handleBuyNow = () => {
    openPayment({
      amount: product.priceValue.toString(),
      currency: "USD",
      recipient: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      paymentTokens: MOCK_PAYMENT_TOKENS,
      metadata: {
        productId: product.id,
        productName: product.name,
        category: product.category,
      },
      onComplete: (result) => {
        console.log("Payment successful!", result);
        alert(`Payment successful! Transaction: ${result.transactionHash}`);
      },
      onError: (error) => {
        console.error("Payment failed:", error);
        alert(`Payment failed: ${error.message}`);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="aspect-square bg-gray-700 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">
                {product.category}
              </span>
            </div>

            {/* Product Name */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {product.name}
              </h1>
              <p className="text-2xl sm:text-3xl font-bold text-purple-400">
                {product.price}
              </p>
            </div>

            {/* Owner Info */}
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Owner</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {product.owner.slice(2, 4).toUpperCase()}
                </div>
                <span className="font-mono text-sm text-white">
                  {product.owner}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Description
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleBuyNow}
                className="w-full bg-purple-600 text-white rounded-xl py-4 font-semibold hover:bg-purple-700 transition-colors"
              >
                Buy Now with Crypto
              </button>
              <button className="w-full bg-gray-800 border-2 border-gray-700 text-white rounded-xl py-4 font-semibold hover:bg-gray-700 transition-colors">
                Make Offer
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-700 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Token ID</span>
                <span className="font-medium text-white">#{product.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Contract Address</span>
                <span className="font-mono text-sm text-white">
                  0xABCD...EFGH
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Token Standard</span>
                <span className="font-medium text-white">ERC-721</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            More from this collection
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.values(PRODUCTS)
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-purple-500/10 transition-shadow group"
                >
                  <div className="aspect-square bg-gray-700">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 text-sm truncate">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-base font-bold text-purple-400">
                      {relatedProduct.price}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            ← Back to All Products
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
