import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {WagmiProvider, useAccount } from "wagmi";
import {
  ConnectButton,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
// import config from "../config/wagmiConfig";
import { useWallet } from "./WalletContext"; 
import { useNavigate } from "react-router-dom";

const WalletInfo = () => {
    const navigate=useNavigate();
  const { address, isConnected } = useAccount();
  const { setWalletAddress } = useWallet();

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
        console.log('wallet connected')
    } else {
      console.log("Disconnected");
      setWalletAddress(null);
      console.log('not connected')
    }
  }, [isConnected, address]);

  return <ConnectButton />;
};

// const customTheme = darkTheme({
//   accentColor: "#000000", // Primary Button Background
//   accentColorForeground: "#ffffff", // Button Text Color
//   borderRadius: "large",
//   fontStack: "system",
// });

const ConnectWallet = () => {
  return (
    <>
    {/* // <RainbowKitProvider theme={customTheme}> */}
      {/* <ConnectButton /> */}
      <WalletInfo />
    {/* </RainbowKitProvider> */}
    </>
  );
};

export default ConnectWallet;
