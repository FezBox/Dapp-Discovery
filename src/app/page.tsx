'use client';

import { useState } from 'react';
import DAppCard from '@/components/DAppCard';
import Filters from '@/components/Filters';
import { getAllDAppMetadata } from '@/services/database';

interface DApp {
  id: number;
  name: string;
  description: string;
  logo: string;
  networks: string[];
  categories: string[];
  url: string;
  popularity: number;
  tvl: string;
  dailyVolume: string;
}

const networkLogos: { [key: string]: string } = {
  arbitrum: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
  avalanche: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  base: "https://raw.githubusercontent.com/base-org/brand-kit/001c0e9b40a67799ebe0418671ac4e02a0c683ce/logo/in-product/Base_Network_Logo.svg",
  bnb: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  ethereum: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  injective: "https://cryptologos.cc/logos/injective-inj-logo.png",
  polygon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  solana: "https://cryptologos.cc/logos/solana-sol-logo.png",
  stacks: "https://cryptologos.cc/logos/stacks-stx-logo.png",
  stellar: "https://cryptologos.cc/logos/stellar-xlm-logo.png",
  sui: "https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg"
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');

  // Get all DApps
  const allDApps = getAllDAppMetadata();

  // Filter DApps based on selected category and network
  const filteredDApps = allDApps.filter(dapp => {
    const matchesCategory = !selectedCategory || dapp.categories?.includes(selectedCategory);
    const matchesNetwork = !selectedNetwork || dapp.networks?.includes(selectedNetwork);
    return matchesCategory && matchesNetwork;
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            DeFi DApps Discovery
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore and discover decentralized applications across multiple blockchain networks
          </p>
        </div>

        {/* Filters */}
        <Filters
          selectedCategory={selectedCategory}
          selectedNetwork={selectedNetwork}
          onCategoryChange={setSelectedCategory}
          onNetworkChange={setSelectedNetwork}
        />

        {/* DApps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDApps.map((dapp) => (
            <DAppCard key={dapp.id} dapp={dapp} />
          ))}
        </div>

        {/* No Results */}
        {filteredDApps.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No DApps Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
