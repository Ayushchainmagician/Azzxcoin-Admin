// src/config/wagmiConfig.js
import { mainnet, bsc, bscTestnet, } from 'wagmi/chains';
import { http } from 'wagmi';
// import icon from '/img/harvest-icon.png'
import { getDefaultConfig, connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
  safeWallet,
  argentWallet,
  bestWallet,
  binanceWallet,
  coinbaseWallet,
  trustWallet
} from '@rainbow-me/rainbowkit/wallets';


// Define wallet connectors
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [rainbowWallet, walletConnectWallet, metaMaskWallet,trustWallet],
    },
    {
      groupName: 'Others',
      wallets: [safeWallet, argentWallet, bestWallet, binanceWallet],
    },
  ],
  {
    appName: 'harvest',
    projectId: 'e057376bba29c0e64a6f4f018852c88b', 
  }
);

// Update the configuration with dynamic chains
const config = getDefaultConfig({       
  connectors,
  appName: 'Harvest',
  projectId: 'e057376bba29c0e64a6f4f018852c88b', 
  chains: [bsc], 
  // transports: {
  //   // [bscTestnet.id]: http('https://bsc-testnet-rpc.publicnode.com'),
  //   [bsc.id]: http('https://bsc.blockrazor.xyz')  
  // },
  ssr: false,
});


export default config;




