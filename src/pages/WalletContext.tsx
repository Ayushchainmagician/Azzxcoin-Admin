import { createContext, useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";
// import { useNavigate } from "react-router-dom";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
// const navigate = useNavigate();
const { address, isConnected } = useAccount();
const [walletAddress, setWalletAddress] = useState(null);

useEffect(() => {
  if (isConnected && address) {
    setWalletAddress(address);
  } else {
    setWalletAddress("");
    // navigate("/");
  }
}, [isConnected, address]);

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
