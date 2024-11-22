// Mock data with a comprehensive list of DApps
const mockDapps = [
    {
        id: 1,
        name: "UniSwap",
        description: "Decentralized trading protocol for automated liquidity provision on Ethereum.",
        logo: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
        networks: ["ethereum", "arbitrum", "polygon"],
        categories: ["defi", "exchange"],
        url: "https://app.uniswap.org",
        popularity: 95,
        createdAt: "2023-01-15",
        tvl: "$5.2B",
        dailyVolume: "$1.2B"
    },
    {
        id: 2,
        name: "Aave",
        description: "Open source liquidity protocol for earning interest on deposits and borrowing assets.",
        logo: "https://cryptologos.cc/logos/aave-aave-logo.png",
        networks: ["ethereum", "polygon"],
        categories: ["defi", "lending"],
        url: "https://app.aave.com",
        popularity: 90,
        createdAt: "2023-02-20",
        tvl: "$3.8B",
        dailyVolume: "$500M"
    },
    {
        id: 3,
        name: "OpenSea",
        description: "The world's largest NFT marketplace for crypto collectibles and non-fungible tokens.",
        logo: "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png",
        networks: ["ethereum", "polygon"],
        categories: ["nft", "marketplace"],
        url: "https://opensea.io",
        popularity: 88,
        createdAt: "2023-03-10",
        tvl: "N/A",
        dailyVolume: "$25M"
    },
    {
        id: 4,
        name: "Axie Infinity",
        description: "Blockchain-based trading and battling game where players collect, breed, and battle creatures.",
        logo: "https://cryptologos.cc/logos/axie-infinity-axs-logo.png",
        networks: ["ethereum", "ronin"],
        categories: ["gaming", "nft"],
        url: "https://axieinfinity.com",
        popularity: 82,
        createdAt: "2023-04-05",
        tvl: "$150M",
        dailyVolume: "$2M"
    },
    {
        id: 5,
        name: "GMX",
        description: "Decentralized perpetual exchange with low fees and zero price impact trades.",
        logo: "https://assets.coingecko.com/coins/images/18323/large/arbit.png",
        networks: ["arbitrum", "avalanche"],
        categories: ["defi", "derivatives"],
        url: "https://app.gmx.io",
        popularity: 85,
        createdAt: "2023-05-01",
        tvl: "$600M",
        dailyVolume: "$100M"
    },
    {
        id: 6,
        name: "Balancer",
        description: "Automated portfolio manager and trading platform, enabling users to create custom pools and trade with minimal slippage.",
        logo: "https://cryptologos.cc/logos/balancer-bal-logo.png",
        networks: ["ethereum", "arbitrum", "polygon"],
        categories: ["defi", "exchange"],
        url: "https://balancer.fi",
        popularity: 88,
        createdAt: "2023-06-15",
        tvl: "$1.8B",
        dailyVolume: "$150M"
    }
];

class DataService {
    constructor() {
        this.apiBaseUrl = 'https://api.yourdappapi.com'; // Replace with actual API endpoint
        this.useApi = false; // Set to true when ready to use real API
    }

    async getDapps() {
        if (this.useApi) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/dapps`);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error('Error fetching dapps:', error);
                return mockDapps; // Fallback to mock data
            }
        }
        return mockDapps;
    }

    async getDappById(id) {
        if (this.useApi) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/dapps/${id}`);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error('Error fetching dapp:', error);
                return mockDapps.find(d => d.id === id);
            }
        }
        return mockDapps.find(d => d.id === parseInt(id));
    }

    async searchDapps(query) {
        if (this.useApi) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/dapps/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error('Error searching dapps:', error);
                return this.searchMockDapps(query);
            }
        }
        return this.searchMockDapps(query);
    }

    searchMockDapps(query) {
        query = query.toLowerCase();
        return mockDapps.filter(dapp => 
            dapp.name.toLowerCase().includes(query) ||
            dapp.description.toLowerCase().includes(query) ||
            dapp.categories.some(cat => cat.toLowerCase().includes(query)) ||
            dapp.networks.some(net => net.toLowerCase().includes(query))
        );
    }

    async getFavorites(userId) {
        if (this.useApi) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/users/${userId}/favorites`);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error('Error fetching favorites:', error);
                return [];
            }
        }
        return JSON.parse(localStorage.getItem('favorites') || '[]');
    }

    async toggleFavorite(userId, dappId) {
        if (this.useApi) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/users/${userId}/favorites/${dappId}`, {
                    method: 'POST'
                });
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error('Error toggling favorite:', error);
            }
        } else {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            const index = favorites.indexOf(dappId);
            if (index === -1) {
                favorites.push(dappId);
            } else {
                favorites.splice(index, 1);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
            return favorites;
        }
    }
}

export const dataService = new DataService();
