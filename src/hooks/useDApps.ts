import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getCachedDAppsData, AggregatedDAppData } from '../services/aggregator';
import { getDAppMetadata, getDAppsByCategory, SUPPORTED_CATEGORIES } from '../services/database';

export function useDApps(
  category?: string,
  network?: string
): UseQueryResult<AggregatedDAppData[]> {
  return useQuery({
    queryKey: ['dapps', category, network],
    queryFn: async () => {
      console.log('Fetching DApps data with filters:', { category, network });
      const dapps = await getCachedDAppsData();
      
      return dapps.filter(dapp => {
        if (!dapp) return false;

        // Category filtering
        const categoryMatch = !category || (dapp.categories && dapp.categories.some(c => {
          // Normalize both strings for comparison
          const normalizedCategory = category.toLowerCase().trim();
          const normalizedDappCategory = c.toLowerCase().trim();
          
          // Check for exact match first
          if (normalizedDappCategory === normalizedCategory) return true;
          
          // Check for partial matches in compound categories
          // e.g., "DeFi" should match "DeFi Lending" or "DeFi Protocol"
          if (normalizedDappCategory.includes(normalizedCategory) || 
              normalizedCategory.includes(normalizedDappCategory)) {
            return true;
          }
          
          return false;
        }));

        // Network filtering
        const networkMatch = !network || 
          (dapp.networks && dapp.networks.some(n => 
            n.toLowerCase().trim() === network.toLowerCase().trim()
          ));

        return categoryMatch && networkMatch;
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDAppDetails(dappId: string): UseQueryResult<AggregatedDAppData> {
  return useQuery({
    queryKey: ['dapp', dappId],
    queryFn: async () => {
      const dapps = await getCachedDAppsData();
      const dapp = dapps.find(d => d.id === dappId);
      if (!dapp) throw new Error(`DApp ${dappId} not found`);
      return dapp;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories(): string[] {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const dapps = await getCachedDAppsData();
      const categories = new Set<string>();
      
      dapps.forEach(dapp => {
        if (dapp.categories) {
          dapp.categories.forEach(category => {
            // Only add categories that are in our supported list
            if (SUPPORTED_CATEGORIES.includes(category)) {
              categories.add(category);
            }
          });
        }
      });
      
      return Array.from(categories).sort();
    },
    staleTime: 5 * 60 * 1000,
  }).data || SUPPORTED_CATEGORIES;
}

export function useNetworks(): string[] {
  return [
    'Ethereum',
    'Arbitrum',
    'Polygon',
    'Base',
    'Solana',
    'Sui',
    'Stellar',
    'Injective',
    'Stacks',
    'BNB Chain',
    'Avalanche'
  ];
}

export function useTrendingDApps(): UseQueryResult<AggregatedDAppData[]> {
  return useQuery({
    queryKey: ['trending-dapps'],
    queryFn: async () => {
      const dapps = await getCachedDAppsData();
      return dapps
        .sort((a, b) => (b.volume?.daily || 0) - (a.volume?.daily || 0))
        .slice(0, 5);
    },
    staleTime: 5 * 60 * 1000,
  });
}
