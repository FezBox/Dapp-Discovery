import fs from 'fs';
import path from 'path';
import https from 'https';
import { getAllDAppMetadata } from '../src/services/database';

const LOGOS_DIR = path.join(process.cwd(), 'public', 'logos');

// Ensure logos directory exists
if (!fs.existsSync(LOGOS_DIR)) {
  fs.mkdirSync(LOGOS_DIR, { recursive: true });
}

// Default logo URLs for major DApps
const DEFAULT_LOGOS: { [key: string]: string } = {
  uniswap: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
  aave: 'https://app.aave.com/icons/icon-144x144.png',
  curve: 'https://classic.curve.fi/logo-square.svg',
  gmx: 'https://raw.githubusercontent.com/gmx-io/gmx-assets/main/gmx-logo.png',
  stargate: 'https://assets.stargate.finance/logos/STG_LOGO.png',
  balanced: 'https://balanced.network/img/balanced-logo.svg',
  // Add more default logos here
};

function downloadLogo(url: string, filename: string): Promise<void> {
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
  const dapps = getAllDAppMetadata();
  
  for (const dapp of dapps) {
    const extension = path.extname(dapp.logo) || '.png';
    const filename = `${dapp.id}${extension}`;
    
    try {
      // Try the logo URL from the database first
      await downloadLogo(dapp.logo, filename);
    } catch (error) {
      console.error(`Failed to download logo for ${dapp.id} from primary source`);
      
      // Try the default logo if available
      if (DEFAULT_LOGOS[dapp.id]) {
        try {
          await downloadLogo(DEFAULT_LOGOS[dapp.id], filename);
        } catch (fallbackError) {
          console.error(`Failed to download default logo for ${dapp.id}`);
        }
      }
    }
  }
}

main().catch(console.error);
