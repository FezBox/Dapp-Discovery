import axios from 'axios';

const LOCAL_API = '/api';

interface Protocol {
  id: string;
  name: string;
  symbol?: string;
  url?: string;
  description?: string;
  logo?: string;
  category?: string;
  chains: string[];
  tvl: number;
  chainTvls: { [key: string]: number };
  change_1h?: number;
  change_1d?: number;
  change_7d?: number;
  volume24h?: number;
}

export async function getAllProtocols(): Promise<Protocol[]> {
  try {
    console.log('Fetching protocols from local API...');
    const response = await axios.get(`${LOCAL_API}/defillama/protocols`);
    console.log('API response:', response.data);

    if (!Array.isArray(response.data)) {
      console.error('Unexpected API response structure:', response.data);
      return [];
    }

    const protocols = response.data.map((p: any) => ({
      id: p.slug || p.name.toLowerCase().replace(/\s+/g, '-'),
      name: p.name,
      symbol: p.symbol,
      url: p.url,
      description: p.description,
      logo: p.logo,
      category: p.category,
      chains: Array.isArray(p.chains) ? p.chains : [],
      tvl: typeof p.tvl === 'number' ? p.tvl : 0,
      chainTvls: p.chainTvls || {},
      change_1h: p.change_1h,
      change_1d: p.change_1d,
      change_7d: p.change_7d,
      volume24h: p.volume24h
    }));

    console.log('Processed protocols:', protocols.slice(0, 2));
    return protocols;
  } catch (error) {
    console.error('Error fetching protocols:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return [];
  }
}

export async function getProtocolTVL(protocol: string): Promise<number> {
  try {
    console.log(`Fetching TVL for ${protocol}...`);
    const response = await axios.get(`${LOCAL_API}/defillama/tvl/${protocol}`);
    console.log(`API response for ${protocol}:`, response.data);
    return response.data.tvl;
  } catch (error) {
    console.error(`Error fetching TVL for ${protocol}:`, error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return 0;
  }
}

export async function getChainTVL(chain: string): Promise<number> {
  try {
    console.log(`Fetching TVL for chain ${chain}...`);
    const response = await axios.get(`${LOCAL_API}/defillama/chains`);
    console.log('API response for chains:', response.data.slice(0, 2)); // Log first 2 chains for debugging
    const chainData = response.data.find((c: any) => c.name.toLowerCase() === chain.toLowerCase());
    console.log(`Chain data for ${chain}:`, chainData);
    return chainData?.tvl || 0;
  } catch (error) {
    console.error(`Error fetching TVL for chain ${chain}:`, error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return 0;
  }
}
