import DAppCard from './DAppCard';
import { useDApps } from '../hooks/useDApps';

interface DAppGridProps {
  category?: string;
  network?: string;
}

export function DAppGrid({ category, network }: DAppGridProps) {
  const { data: dapps, isLoading, error, isError } = useDApps(category, network);

  console.log('DAppGrid render:', { dapps, isLoading, error, category, network });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading DApps: {error?.message}</p>
        <pre className="mt-4 text-sm text-gray-500 overflow-auto">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  if (!dapps?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No DApps found {category ? `in category "${category}"` : ''} 
          {network ? `on network "${network}"` : ''}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dapps.map((dapp) => (
        <DAppCard key={dapp.id} dapp={dapp} />
      ))}
    </div>
  );
}
