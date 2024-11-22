const https = require('https');
const fs = require('fs');
const path = require('path');

const DEFI_LLAMA_API = 'https://api.llama.fi/protocols';
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'dapps.json');

// Ensure the data directory exists
const dataDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper function to make HTTP requests
function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Clean and normalize category names
function normalizeCategory(category) {
  const categoryMap = {
    'Dexes': 'DEX',
    'Lending': 'Lending',
    'Yield': 'Yield',
    'Bridge': 'Bridge',
    'Yield Aggregator': 'Yield',
    'Derivatives': 'Derivatives',
    'CDP': 'CDP',
    'Insurance': 'Insurance',
    'Options': 'Options',
    'Indexes': 'Index',
    'NFT Lending': 'NFT',
    'NFT Marketplace': 'NFT',
    'Algo-Stables': 'Stablecoins',
    'Stablecoins': 'Stablecoins',
    'RWA': 'Real World Assets',
    'Gaming': 'Gaming',
  };
  return categoryMap[category] || category;
}

async function main() {
  try {
    console.log('Fetching protocols from DeFi Llama...');
    const protocols = await fetchData(DEFI_LLAMA_API);

    // Initialize networks map
    const networkDapps = {};

    // Process each protocol
    protocols.forEach(protocol => {
      const dapp = {
        id: protocol.slug,
        name: protocol.name,
        categories: protocol.category 
          ? [normalizeCategory(protocol.category)]
          : [],
        description: protocol.description || '',
        url: protocol.url || '',
        chains: protocol.chains || []
      };

      // Add to each network the protocol supports
      dapp.chains.forEach(chain => {
        if (!networkDapps[chain]) {
          networkDapps[chain] = [];
        }
        networkDapps[chain].push(dapp);
      });
    });

    // Sort networks by number of DApps
    const sortedNetworks = Object.entries(networkDapps)
      .sort(([, a], [, b]) => b.length - a.length)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    // Create the final data structure
    const output = {
      lastUpdated: new Date().toISOString(),
      networks: sortedNetworks
    };

    // Save to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    
    // Print summary
    console.log('\nSummary:');
    Object.entries(sortedNetworks).forEach(([network, dapps]) => {
      console.log(`${network}: ${dapps.length} DApps`);
    });
    console.log(`\nData saved to ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
