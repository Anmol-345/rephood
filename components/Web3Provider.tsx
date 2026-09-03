"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { useState } from 'react';

const botchain = defineChain({
  id: 7233, // Placeholder for Botchain ID
  name: 'Botchain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.botchain.chain'] }, // Placeholder RPC
  },
  blockExplorers: {
    default: { name: 'Botchain Explorer', url: 'https://explorer.botchain.chain' },
  },
});

const config = createConfig({
  chains: [botchain],
  transports: {
    [botchain.id]: http(),
  },
});

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
