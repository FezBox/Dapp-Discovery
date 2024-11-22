import Image from 'next/image';
import Link from 'next/link';
import { useTrendingDApps } from '../hooks/useDApps';

export function TrendingDApps() {
  const { data: trendingDApps, isLoading, error } = useTrendingDApps();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Trending DApps
        </h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !trendingDApps?.length) {
    return null;
  }

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Trending DApps
      </h2>
      <div className="space-y-4">
        {trendingDApps.map((dapp, index) => (
          <Link key={dapp.id} href={`/dapp/${dapp.id}`}>
            <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
              <div className="flex-shrink-0 w-8 text-gray-400 dark:text-gray-500 font-medium">
                #{index + 1}
              </div>
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src={dapp.logo}
                  alt={dapp.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {dapp.name}
                </h3>
                <div className="flex space-x-2">
                  {dapp.categories.slice(0, 2).map((category) => (
                    <span
                      key={category}
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatVolume(dapp.volume?.daily || 0)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  24h Volume
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
