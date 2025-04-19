import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WalletProvider } from './pages/WalletContext.tsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import config from './config/WagmiConfig.js';
import { WagmiProvider } from "wagmi";
import {
  ConnectButton,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { BrowserRouter as Router } from 'react-router-dom';

const queryClient = new QueryClient();
const customTheme = darkTheme({
  accentColor: "#000000", 
  accentColorForeground: "#ffffff", 
  borderRadius: "large",
  fontStack: "system",
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

createRoot(rootElement).render(
  <Router>
     <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
      <RainbowKitProvider theme={customTheme}>
        <App />
        </RainbowKitProvider>
      </WalletProvider>
    </QueryClientProvider>
    </WagmiProvider>
    </Router>
 );
