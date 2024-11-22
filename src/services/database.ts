import dappsData from '../data/dapps.json';

export interface DAppMetadata {
  id: string;
  name: string;
  description: string;
  categories: string[];
  url: string;
  networks: string[];
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
    }>;
  };
}

// Convert the imported data to our DAppMetadata format
const DAPP_METADATA: { [key: string]: DAppMetadata } = {};

// Process the imported data
Object.values((dappsData as DappsData).networks).forEach(dapps => {
  dapps.forEach(dapp => {
    if (!DAPP_METADATA[dapp.id]) {
      DAPP_METADATA[dapp.id] = {
        id: dapp.id,
        name: dapp.name,
        description: dapp.description,
        categories: dapp.categories,
        url: dapp.url,
        networks: dapp.chains
      };
    }
  });
});

export function getDAppMetadata(id: string): DAppMetadata | null {
  return DAPP_METADATA[id] || null;
}

export function getAllDAppMetadata(): DAppMetadata[] {
  return Object.values(DAPP_METADATA);
}

export function getDAppById(id: string): DAppMetadata | undefined {
  return Object.values(DAPP_METADATA).find(dapp => dapp.id === id);
}

export function getDAppsByCategory(category: string): DAppMetadata[] {
  return Object.values(DAPP_METADATA).filter(dapp => 
    dapp.categories.some(c => c.toLowerCase() === category.toLowerCase())
  );
}

export function getDAppsByNetwork(network: string): DAppMetadata[] {
  return Object.values(DAPP_METADATA).filter(dapp => 
    dapp.networks.some(n => n.toLowerCase() === network.toLowerCase())
  );
}

// Get all unique networks
export function getAllNetworks(): string[] {
  const networks = new Set<string>();
  Object.values(DAPP_METADATA).forEach(dapp => {
    dapp.networks.forEach(network => networks.add(network));
  });
  return Array.from(networks).sort();
}

// Get all unique categories
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  Object.values(DAPP_METADATA).forEach(dapp => {
    dapp.categories.forEach(category => categories.add(category));
  });
  return Array.from(categories).sort();
}

// Get network statistics
export function getNetworkStats(): { [network: string]: number } {
  const stats: { [network: string]: number } = {};
  Object.values((dappsData as DappsData).networks).forEach((dapps, network) => {
    stats[network] = dapps.length;
  });
  return stats;
}
