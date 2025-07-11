'use client';

import React from 'react';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl } from '@mysten/sui/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  },
});

const networks = {
  testnet: {
    url: getFullnodeUrl('testnet'),
  },
  mainnet: {
    url: getFullnodeUrl('mainnet'),
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  console.log('Providers component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider
          autoConnect
          preferredWallets={['Sui Wallet', 'Ethos Wallet', 'Suiet']}
        >
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
} 