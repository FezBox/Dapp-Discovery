import * as QuickNode from './quicknode';
import * as DeFiLlama from './defillama';
import * as CoinGecko from './coingecko';

export interface AggregatedDAppData {
  id: string;
  name: string;
  description: string;
  logo: string;
  networks: string[];
  categories: string[];
  url: string;
  volume?: {
    daily?: number;
    weekly?: number;
    monthly?: number;
  };
  token?: {
    price: number;
    priceChange24h: number;
    marketCap: number;
    volume24h: number;
  };
  gasPrices?: { [key: string]: string };
}

const PROTOCOL_ADDRESSES: { [key: string]: { [key: string]: string } } = {
  uniswap: {
    ethereum: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    arbitrum: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
    polygon: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
    base: '0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5'
  },
  balanced: {
    arbitrum: '0xBalancedArbitrumAddress',
    base: '0xBalancedBaseAddress',
    sui: '0xBalancedSuiAddress',
    solana: 'BalancedSolanaAddress',
    stacks: '0xBalancedStacksAddress',
    icon: 'hx1234567890balanced',
    havah: '0xBalancedHavahAddress',
    injective: '0xBalancedInjectiveAddress',
    archway: '0xBalancedArchwayAddress',
    bnb: '0xBalancedBNBAddress',
    avalanche: '0xBalancedAvalancheAddress'
  },
  aave: {
    ethereum: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    polygon: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
    arbitrum: '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
  },
  curve: {
    ethereum: '0xD533a949740bb3306d119CC777fa900bA034cd52',
    polygon: '0x172370d5Cd63279eFa6d502DAB29171933a610AF',
    arbitrum: '0x11cDb42B0EB46D2295872a9FFCac5425011c034978'
  },
  gmx: {
    arbitrum: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    avalanche: '0x62edc0692BD897D2295872a9FFCac5425011c661'
  },
  sushiswap: {
    ethereum: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
    polygon: '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a',
    arbitrum: '0xd4d42F0b6DEF4CE0383636770eF773390d85c61A'
  }
};

export async function getDAppData(protocolId: string): Promise<AggregatedDAppData> {
  try {
    // Fetch token data if available
    const tokenData = await CoinGecko.getTokenData(protocolId);
    
    // Fetch on-chain data for each network
    const gasPrices: { [key: string]: string } = {};
    
    if (PROTOCOL_ADDRESSES[protocolId]) {
      for (const [network, address] of Object.entries(PROTOCOL_ADDRESSES[protocolId])) {
        // Get gas prices
        const gasPrice = await QuickNode.getGasPrice(network);
        if (gasPrice !== '0') gasPrices[network] = gasPrice;
      }
    }

    return {
      id: protocolId,
      name: tokenData?.name || protocolId,
      description: '', // Add description from your database
      logo: tokenData?.image || '',
      networks: Object.keys(PROTOCOL_ADDRESSES[protocolId] || {}),
      categories: [], // Add categories from your database
      url: '', // Add URL from your database
      token: tokenData ? {
        price: tokenData.current_price,
        priceChange24h: tokenData.price_change_percentage_24h,
        marketCap: tokenData.market_cap,
        volume24h: tokenData.total_volume
      } : undefined,
      gasPrices
    };
  } catch (error) {
    console.error(`Error aggregating data for ${protocolId}:`, error);
    throw error;
  }
}

export async function getAllDAppsData(): Promise<AggregatedDAppData[]> {
  try {
    // Get all protocols from DeFi Llama
    const protocols = await DeFiLlama.getAllProtocols();
    
    // Get data for each protocol
    const dappsData = await Promise.all(
      protocols
        .filter(p => PROTOCOL_ADDRESSES[p.id.toLowerCase()])
        .map(p => getDAppData(p.id.toLowerCase()))
    );

    return dappsData;
  } catch (error) {
    console.error('Error fetching all DApps data:', error);
    return [];
  }
}

// Cache the data for 5 minutes
let cachedData: AggregatedDAppData[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

import { getAllDAppMetadata } from './database';

export async function getCachedDAppsData(): Promise<AggregatedDAppData[]> {
  const now = Date.now();
  if (!cachedData || now - lastCacheTime > CACHE_DURATION) {
    try {
      // Get all DApp metadata from our database first
      const dappMetadata = await getAllDAppMetadata();
      
      // Get token data from CoinGecko
      const tokenPromises = dappMetadata.map(async (dapp) => {
        try {
          const tokenData = await CoinGecko.getTokenData(dapp.id);
          return { id: dapp.id, tokenData };
        } catch (error) {
          console.error(`Error fetching token data for ${dapp.id}:`, error);
          return { id: dapp.id, tokenData: null };
        }
      });

      const tokenResults = await Promise.all(tokenPromises);
      const tokenDataMap = Object.fromEntries(
        tokenResults.map(({ id, tokenData }) => [id, tokenData])
      );

      // Aggregate the data starting with our database entries
      cachedData = dappMetadata.map((dapp): AggregatedDAppData => {
        const tokenData = tokenDataMap[dapp.id];

        return {
          id: dapp.id,
          name: dapp.name,
          description: dapp.description,
          logo: dapp.logo,
          categories: dapp.categories,
          url: dapp.url,
          networks: [],
          ...(tokenData && {
            token: {
              price: tokenData.price,
              priceChange24h: tokenData.priceChange24h,
              marketCap: tokenData.marketCap,
              volume24h: tokenData.volume24h,
            },
          }),
        };
      });

      lastCacheTime = now;
      console.log('Cache updated with', cachedData.length, 'DApps');
    } catch (error) {
      console.error('Error updating cache:', error);
      if (!cachedData) {
        // If we have no cached data, return data from our database without metrics
        cachedData = await getAllDAppMetadata().then(dappMetadata => dappMetadata.map(dapp => ({
          id: dapp.id,
          name: dapp.name,
          description: dapp.description,
          logo: dapp.logo,
          categories: dapp.categories,
          url: dapp.url,
          networks: [],
        })));
      }
    }
  }

  return cachedData;
}
