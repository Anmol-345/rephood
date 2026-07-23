// Script to Initialize Agent on Virtuals ACP Marketplace (v2)

import { 
  AcpAgent, 
  PrivyAlchemyEvmProviderAdapter 
} from "@virtuals-protocol/acp-node-v2";
import { base } from "@account-kit/infra";

async function main() {
  console.log("Initializing ACP Node v2 Provider...");

  // 1. Setup Provider Adapter
  const provider = await PrivyAlchemyEvmProviderAdapter.create({
    walletAddress: process.env.AGENT_WALLET_ADDRESS || "YOUR_AGENT_WALLET_ADDRESS",
    walletId: process.env.AGENT_WALLET_ID || "YOUR_AGENT_WALLET_ID",
    signerPrivateKey: process.env.AGENT_SIGNER_PRIVATE_KEY || "YOUR_SIGNER_PRIVATE_KEY",
    chains: [base], // Defaulting to base as per v2 standard, can be adjusted
  });

  // 2. Initialize ACP Agent
  const agent = await AcpAgent.create({
    evmProvider: provider,
  });

  // 3. Listen for Incoming Job Events for RepHood
  agent.on("entry", async (session, entry) => {
    if (entry.kind === "system") {
      switch (entry.event.type) {
        case "job.created":
          console.log(`[RepHood] Received job #${session.job.id} for: ${session.job.description}`);
          await session.accept("Task accepted, processing requirements.");
          break;

        case "job.funded":
          console.log(`[RepHood] Job #${session.job.id} funded. Executing telemetry audit...`);
          // Here is where RepHood would run its reputation analysis
          await session.deliver({ status: "success", result: "Completed on-chain reputation audit." });
          break;

        case "job.completed":
          console.log(`[RepHood] Job #${session.job.id} completed successfully!`);
          break;

        case "job.rejected":
        case "job.expired":
          console.log(`[RepHood] Job ended with state: ${entry.event.type}`);
          break;
      }
    }
  });

  // 4. Start Event Stream Listener
  await agent.start();
  console.log("RepHood ACP Agent started and listening for incoming jobs...");

  // Graceful Shutdown
  process.on("SIGINT", async () => {
    console.log("Stopping RepHood ACP Agent...");
    await agent.stop();
    process.exit(0);
  });
}

// If run directly
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error);
}
