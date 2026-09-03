import { NextRequest, NextResponse } from "next/server";
import { keccak256, encodePacked } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, vtx, aAge, mFlag, nonce } = body;

    // Validate required fields
    if (!agentId || vtx === undefined || aAge === undefined || mFlag === undefined || nonce === undefined) {
      return NextResponse.json({ error: "Missing required telemetry fields" }, { status: 400 });
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

    // Hash payload: agentId(string), vtx(uint256), aAge(uint256), mFlag(uint256), nonce(uint256)
    const messageHash = keccak256(
      encodePacked(
        ['string', 'uint256', 'uint256', 'uint256', 'uint256'],
        [agentId, BigInt(vtx), BigInt(aAge), BigInt(mFlag), BigInt(nonce)]
      )
    );
    
    // Sign the hash
    const signature = await backendSigner.signMessage({ message: { raw: messageHash } });

    return NextResponse.json({ signature }, { status: 200 });

  } catch (error) {
    console.error("Failed to sign telemetry:", error);
    return NextResponse.json({ error: "Failed to process signature" }, { status: 500 });
  }
}
