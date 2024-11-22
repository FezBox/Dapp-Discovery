const fs = require('fs');
const path = require('path');
const https = require('https');

const LOGOS_DIR = path.join(process.cwd(), 'public', 'logos');

// Ensure logos directory exists
if (!fs.existsSync(LOGOS_DIR)) {
  fs.mkdirSync(LOGOS_DIR, { recursive: true });
}

// Default logo URLs for major DApps
const DEFAULT_LOGOS = {
  uniswap: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
  aave: 'https://app.aave.com/icons/icon-144x144.png',
  curve: 'https://classic.curve.fi/logo-square.svg',
  gmx: 'https://raw.githubusercontent.com/gmx-io/gmx-assets/main/gmx-logo.png',
  stargate: 'https://assets.stargate.finance/logos/STG_LOGO.png',
  balanced: 'https://balanced.network/img/balanced-logo.svg',
  opensea: 'https://storage.googleapis.com/opensea-static/Logomark/OpenSea-Full-Logo%20(dark).svg',
  blur: 'https://blur.io/logo.svg',
};

function downloadLogo(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(LOGOS_DIR, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`Logo already exists: ${filename}`);
      resolve();
      return;
    }

    console.log(`Downloading logo: ${url}`);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded: ${filename}`);
          resolve();
        });
      } else {
        console.error(`Failed to download ${url}: ${response.statusCode}`);
        reject(new Error(`HTTP Status ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.error(`Error downloading ${url}:`, err);
      reject(err);
    });
  });
}

async function main() {
  const dapps = Object.keys(DEFAULT_LOGOS);
  
  for (const dappId of dapps) {
    const url = DEFAULT_LOGOS[dappId];
    const extension = path.extname(url) || '.png';
    const filename = `${dappId}${extension}`;
    
    try {
      await downloadLogo(url, filename);
    } catch (error) {
      console.error(`Failed to download logo for ${dappId}`);
    }
  }
}

main().catch(console.error);
