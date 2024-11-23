import dappsData from '@/data/dapps.json';

export interface DAppMetadata {
  id: string;
  name: string;
  description: string;
  categories: string[];
  url: string;
  networks: string[];
  logo?: string;
}

interface DappsData {
  lastUpdated: string;
  networks: {
    [key: string]: Array<{
      id: string;
      name: string;
      categories: string[];
      description: string;
      url: string;
      chains: string[];
      logo?: string;
    }>;
  };
}

// Convert the imported data to our DAppMetadata format
const processedDapps: DAppMetadata[] = [];

// Process the imported data
Object.entries((dappsData as DappsData).networks).forEach(([network, dapps]) => {
  dapps.forEach(dapp => {
    processedDapps.push({
      id: dapp.id,
      name: dapp.name,
      description: dapp.description,
      categories: dapp.categories,
      url: dapp.url,
      networks: dapp.chains,
      logo: dapp.logo
    });
  });
});

export function getAllDAppMetadata(): DAppMetadata[] {
  return processedDapps;
}

export function getDAppById(id: string): DAppMetadata | undefined {
  return processedDapps.find(dapp => dapp.id === id);
}

export function getDAppsByCategory(category: string): DAppMetadata[] {
  if (!category) return processedDapps;
  return processedDapps.filter(dapp => dapp.categories.includes(category));
}

export function getDAppsByNetwork(network: string): DAppMetadata[] {
  if (!network) return processedDapps;
  return processedDapps.filter(dapp => dapp.networks.includes(network));
}

export function getAllCategories(): string[] {
  const categories = new Set<string>();
  processedDapps.forEach(dapp => {
    dapp.categories.forEach(category => categories.add(category));
  });
  return Array.from(categories).sort();
}

export function getAllNetworks(): string[] {
  const networks = new Set<string>();
  processedDapps.forEach(dapp => {
    dapp.networks.forEach(network => networks.add(network));
  });
  return Array.from(networks).sort();
}

export function getNetworkStats(): { [network: string]: number } {
  const stats: { [network: string]: number } = {};
  processedDapps.forEach(dapp => {
    dapp.networks.forEach(network => {
      stats[network] = (stats[network] || 0) + 1;
    });
  });
  return stats;
}
