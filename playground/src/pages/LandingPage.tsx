import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  category: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Cosmic Dreamer NFT",
    price: "$50",
    priceValue: 50,
    image: "/product-1.png",
    category: "NFT",
  },
  {
    id: 2,
    name: "Pixel Warriors Pack",
    price: "$75",
    priceValue: 75,
    image: "/product-2.png",
    category: "Game",
  },
  {
    id: 3,
    name: "DeFi Starter Bundle",
    price: "$100",
    priceValue: 100,
    image: "/product-3.png",
    category: "DeFi",
  },
  {
    id: 4,
    name: "Rare Collectible #42",
    price: "$125",
    priceValue: 125,
    image: "/product-4.png",
    category: "NFT",
  },
];

const TABS = ["All", "NFT", "Game", "DeFi"];

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesTab = activeTab === "All" || product.category === activeTab;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="DustFi Logo" className="w-9 h-9" />
            <div>
              <p className="text-xs text-gray-400">DustFi</p>
              <p className="text-sm font-semibold text-white">
                Multi Token Payment
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/example"
              className="px-4 py-2 text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
            >
              SDK Playground
            </Link>
            <button
              className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
              title="Swap"
            >
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
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>
            <button
              className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
              title="Notifications"
            >
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-12 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-purple-500/10 transition-shadow group"
              >
                <div className="aspect-square bg-gray-700 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
                    {product.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1 text-sm truncate">
                    {product.name}
                  </h3>
                  <p className="text-base font-bold text-purple-400">
                    {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No products found.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-4 sm:px-6 lg:px-8 py-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
          <p>
            Powered by{" "}
            <span className="font-semibold text-white">MultiCoin SDK</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
