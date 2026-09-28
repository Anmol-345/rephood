import { NextRequest, NextResponse } from "next/server";
import { keccak256, encodePacked, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { agentId, vtx, aAge, mFlag, nonce } = body;

    // Validate required fields
    if (!agentId || vtx === undefined || aAge === undefined || mFlag === undefined) {
      return NextResponse.json({ error: "Missing required telemetry fields" }, { status: 400 });
    }

    try {
      const publicClient = createPublicClient({ transport: http('https://rpc.botchain.ai') });
      const onChainNonce = await publicClient.readContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: [{ name: "agentNonces", type: "function", stateMutability: "view", inputs: [{ name: "agentId", type: "string" }], outputs: [{ name: "", type: "uint256" }] }],
        functionName: "agentNonces",
        args: [agentId]
      });
      nonce = Number(onChainNonce);
    } catch (e) {
      console.warn("Failed to fetch on-chain nonce in backend, falling back to frontend nonce:", e);
      nonce = nonce || 0;
    }

    // Securely pull the private key from Vercel Environment Variables
    const privateKeyHex = process.env.AGENT_SIGNER_PRIVATE_KEY;
    if (!privateKeyHex) {
      console.error("Missing AGENT_SIGNER_PRIVATE_KEY in environment");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Ensure it's correctly formatted as a hex string
    const formattedKey = privateKeyHex.startsWith("0x") ? privateKeyHex : `0x${privateKeyHex}`;
    
    // Create the account from the secure key
    const backendSigner = privateKeyToAccount(formattedKey as `0x${string}`);
    
    console.log("=== DIAGNOSTICS: BACKEND SIGNER ===");
    console.log("Derived Address from Private Key:", backendSigner.address);
    console.log("Expected AGENT_WALLET_ADDRESS:", process.env.AGENT_WALLET_ADDRESS);
    
    if (backendSigner.address.toLowerCase() !== process.env.AGENT_WALLET_ADDRESS?.toLowerCase()) {
      console.warn("WARNING: The private key derives a DIFFERENT address than AGENT_WALLET_ADDRESS!");
    }

    // Hash payload: agentId(string), vtx(uint256), aAge(uint256), mFlag(uint256), nonce(uint256)
    const messageHash = keccak256(
      encodePacked(
        ['string', 'uint256', 'uint256', 'uint256', 'uint256'],
        [agentId, BigInt(vtx), BigInt(aAge), BigInt(mFlag), BigInt(nonce)]
      )
    );
    
    // Sign the hash
    let signature = await backendSigner.signMessage({ message: { raw: messageHash } });

    // Standardize `v` value to 27/28 for ecrecover compatibility
    const vHex = signature.slice(-2);
    if (vHex === '00') {
      signature = signature.slice(0, -2) + '1b'; // 27 in hex
    } else if (vHex === '01') {
      signature = signature.slice(0, -2) + '1c'; // 28 in hex
    }

    return NextResponse.json({ signature }, { status: 200 });

  } catch (error) {
    console.error("Failed to sign telemetry:", error);
    return NextResponse.json({ error: "Failed to process signature" }, { status: 500 });
  }
}
