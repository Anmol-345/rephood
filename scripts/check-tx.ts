import { createPublicClient, http } from 'viem';

const txHash = '0x10b5c41d3acd1f01939b839d6b5e1517d6868c92bd21786c5561b36b954f84e3';

const rpcs = [
  { name: 'Botchain', url: 'https://rpc.botchain.ai' },
  { name: 'Botchain Alt', url: 'https://rpc.botchain.network' },
  { name: 'Base', url: 'https://mainnet.base.org' },
  { name: 'Ethereum Mainnet', url: 'https://cloudflare-eth.com' }
];

async function main() {
  console.log(`Searching for TX: ${txHash}`);
  
  for (const rpc of rpcs) {
    try {
      const client = createPublicClient({ transport: http(rpc.url) });
      const tx = await client.getTransaction({ hash: txHash as `0x${string}` });
      if (tx) {
        console.log(`\n✅ FOUND ON NETWORK: ${rpc.name}`);
        console.log(`Block: ${tx.blockNumber}`);
        console.log(`From: ${tx.from}`);
        console.log(`To: ${tx.to}`);
        return;
      }
    } catch (e: any) {
      // Ignored
    }
  }
  console.log(`\n❌ Could not find transaction on any known RPC.`);
}

main();
