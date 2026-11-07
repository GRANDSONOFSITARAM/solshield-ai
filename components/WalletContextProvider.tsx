'use client';

import React, { FC, ReactNode, useMemo, useState, createContext, useContext } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import default wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface NetworkContextType {
  network: WalletAdapterNetwork;
  setNetwork: (network: WalletAdapterNetwork) => void;
  endpoint: string;
}

const NetworkContext = createContext<NetworkContextType>({
  network: WalletAdapterNetwork.Devnet,
  setNetwork: () => {},
  endpoint: clusterApiUrl(WalletAdapterNetwork.Devnet),
});

export const useSolanaNetwork = () => useContext(NetworkContext);

const ConnectionProviderComponent = ConnectionProvider as any;
const WalletProviderComponent = WalletProvider as any;
const WalletModalProviderComponent = WalletModalProvider as any;

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.Devnet);

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], []);

  return (
    <NetworkContext.Provider value={{ network, setNetwork, endpoint }}>
      <ConnectionProviderComponent endpoint={endpoint}>
        <WalletProviderComponent wallets={wallets} autoConnect={false}>
          <WalletModalProviderComponent>{children}</WalletModalProviderComponent>
        </WalletProviderComponent>
      </ConnectionProviderComponent>
    </NetworkContext.Provider>
  );
};
