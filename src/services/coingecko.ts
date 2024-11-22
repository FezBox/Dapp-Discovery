import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  image: string;
}

export async function getTokenData(tokenId: string): Promise<TokenData | null> {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${tokenId}&order=market_cap_desc&per_page=1&page=1&sparkline=false`
    );
    return response.data[0] || null;
  } catch (error) {
    console.error(`Error fetching token data for ${tokenId}:`, error);
    return null;
  }
}

export async function getTokenPrice(tokenId: string, currency: string = 'usd'): Promise<number> {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/simple/price?ids=${tokenId}&vs_currencies=${currency}`
    );
    return response.data[tokenId][currency];
  } catch (error) {
    console.error(`Error fetching price for ${tokenId}:`, error);
    return 0;
  }
}

export async function getMarketChart(
  tokenId: string,
  days: number = 1,
  currency: string = 'usd'
): Promise<{ prices: [number, number][]; volumes: [number, number][] }> {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/${tokenId}/market_chart?vs_currency=${currency}&days=${days}`
    );
    return {
      prices: response.data.prices,
      volumes: response.data.total_volumes,
    };
  } catch (error) {
    console.error(`Error fetching market chart for ${tokenId}:`, error);
    return { prices: [], volumes: [] };
  }
}

export async function getTrendingTokens(): Promise<TokenData[]> {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=volume_desc&per_page=10&page=1&sparkline=false`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return [];
  }
}
