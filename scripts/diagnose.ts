import { createPublicClient, http, encodeFunctionData, keccak256, encodePacked } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import * as dotenv from 'dotenv';
dotenv.config();

const client = createPublicClient({
  transport: http('https://rpc.botchain.ai')
});

const abi = [{
  "inputs": [],
  "name": "trustedSigner",
  "outputs": [{"internalType": "address", "name": "", "type": "address"}],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    { "name": "agentId", "type": "string" },
    { "name": "vtx", "type": "uint256" },
    { "name": "aAge", "type": "uint256" },
    { "name": "mFlag", "type": "uint256" },
    { "name": "ipfsHash", "type": "string" },
    { "name": "signature", "type": "bytes" }
  ],
  "name": "computeAndEmitAttestation",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{ "name": "", "type": "string" }],
  "name": "agentNonces",
  "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "stateMutability": "view",
  "type": "function"
}];

const CONTRACT_ADDRESS = '0x15D537637E28bF31fFC96A3B601e5502B18df585';
const SENDER = '0x7f0ebe6bffaf408ed4e92bc745d692c2f99b7fd1'; // just for simulation
const PRIVATE_KEY = process.env.AGENT_SIGNER_PRIVATE_KEY || '';

async function main() {
  try {
    const signer = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: abi,
      functionName: 'trustedSigner'
    });
    console.log("TRUSTED SIGNER ON CHAIN:", signer);

    const agentId = "VAGT-LIVE-0";
    const vtx = BigInt(100);
    const aAge = BigInt(50);
    const mFlag = BigInt(0);
    const ipfsHash = "QmMockHash";
    
    const nonce = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'agentNonces',
      args: [agentId]
    });
    console.log("NONCE:", nonce);

    // Let's try to sign it exactly like the backend does
    const formattedKey = PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`;
    console.log("Attempting to parse private key:", formattedKey.slice(0, 10) + "...");
    const account = privateKeyToAccount(formattedKey as `0x${string}`);
    console.log("Account generated from private key:", account.address);

    const messageHash = keccak256(
      encodePacked(
        ['string', 'uint256', 'uint256', 'uint256', 'uint256'],
        [agentId, vtx, aAge, mFlag, nonce as bigint]
      )
    );
    const signature = await account.signMessage({ message: { raw: messageHash } });
    console.log("Generated Signature:", signature);

    console.log("Simulating transaction...");
    const res = await client.call({
      to: CONTRACT_ADDRESS,
      data: encodeFunctionData({
        abi,
        functionName: 'computeAndEmitAttestation',
        args: [agentId, vtx, aAge, mFlag, ipfsHash, signature]
      }),
      account: SENDER
    });
    console.log("Simulation SUCCESS!");
  } catch (e: any) {
    console.error("Simulation FAILED!");
    console.error(e.message || e);
  }
}

main();
