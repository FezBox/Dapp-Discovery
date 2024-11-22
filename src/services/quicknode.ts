import { ethers } from 'ethers';

const providers: { [key: string]: ethers.JsonRpcProvider } = {
  ethereum: new ethers.JsonRpcProvider(process.env.QUICKNODE_ETH_ENDPOINT),
  arbitrum: new ethers.JsonRpcProvider(process.env.QUICKNODE_ARB_ENDPOINT),
  base: new ethers.JsonRpcProvider(process.env.QUICKNODE_BASE_ENDPOINT),
  bnb: new ethers.JsonRpcProvider(process.env.QUICKNODE_BNB_ENDPOINT),
  polygon: new ethers.JsonRpcProvider(process.env.QUICKNODE_POLYGON_ENDPOINT),
};

// Common ABIs for DeFi protocols
const ERC20_ABI = [
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
];

export async function getProtocolTVL(protocolAddress: string, network: string): Promise<number> {
  try {
    const provider = providers[network];
    if (!provider) throw new Error(`No provider for network: ${network}`);

    const contract = new ethers.Contract(protocolAddress, ERC20_ABI, provider);
    const tvl = await contract.totalSupply();
    return Number(ethers.formatEther(tvl));
  } catch (error) {
    console.error(`Error fetching TVL for ${protocolAddress} on ${network}:`, error);
    return 0;
  }
}

export async function getProtocolVolume(
  protocolAddress: string,
  network: string,
  blockRange: number = 7200 // ~24 hours
): Promise<number> {
  try {
    const provider = providers[network];
    if (!provider) throw new Error(`No provider for network: ${network}`);

    const currentBlock = await provider.getBlockNumber();
    const fromBlock = currentBlock - blockRange;

    // Get transfer events
    const filter = {
      address: protocolAddress,
      topics: [ethers.id('Transfer(address,address,uint256)')],
      fromBlock,
      toBlock: currentBlock,
    };

    const logs = await provider.getLogs(filter);
    const volume = logs.reduce((acc, log) => acc + Number(log.data), 0);
    return Number(ethers.formatEther(volume));
  } catch (error) {
    console.error(`Error fetching volume for ${protocolAddress} on ${network}:`, error);
    return 0;
  }
}

export async function getGasPrice(network: string): Promise<string> {
  try {
    const provider = providers[network];
    if (!provider) throw new Error(`No provider for network: ${network}`);

    const gasPrice = await provider.getGasPrice();
    return ethers.formatUnits(gasPrice, 'gwei');
  } catch (error) {
    console.error(`Error fetching gas price for ${network}:`, error);
    return '0';
  }
}
