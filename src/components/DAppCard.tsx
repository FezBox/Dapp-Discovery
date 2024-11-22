import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DAppMetadata } from '@/services/database';

interface DAppCardProps {
  dapp: DAppMetadata;
}

const DAppCard = ({ dapp }: DAppCardProps) => {
  const [imageError, setImageError] = React.useState(false);
  const maxNetworksToShow = 3;

  // Ensure categories and networks are arrays
  const categories = dapp.categories || [];
  const networks = dapp.networks || [];

  // Create fallback logo from first letter of name
  const fallbackLogo = (
    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
      {dapp.name.charAt(0)}
    </div>
  );

  return (
    <Link href={`/dapp/${dapp.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start space-x-4">
          {/* Logo or Fallback */}
          <div className="flex-shrink-0">
            {imageError ? (
              fallbackLogo
            ) : (
              <Image
                src={`/logos/${dapp.id}.png`}
                alt={`${dapp.name} logo`}
                width={48}
                height={48}
                className="rounded-full"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-grow">
            <h3 className="text-lg font-semibold mb-1 dark:text-white">{dapp.name}</h3>
            
            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.slice(0, 3).map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                  >
                    {category}
                  </span>
                ))}
                {categories.length > 3 && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    +{categories.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Networks */}
            {networks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {networks.slice(0, maxNetworksToShow).map((network) => (
                  <span
                    key={network}
                    className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                  >
                    {network}
                  </span>
                ))}
                {networks.length > maxNetworksToShow && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    +{networks.length - maxNetworksToShow}
                  </span>
                )}
              </div>
            )}

            {/* Description - truncated */}
            {dapp.description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {dapp.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DAppCard;
