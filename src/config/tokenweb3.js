// Read Functions
import {
    readContract,
    writeContract,
    waitForTransactionReceipt,
  } from "@wagmi/core";
import config from "./WagmiConfig.js";
import {tokenAbi,usdtAddress} from "./tokenabi.js";

export async function getOwnerAddress() {
    try {
      return await readContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "owner",
      });
    } catch (error) {
      return null;
    }
  }
  
  export async function getTotalSupply() {
    try {
      return await readContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "totalSupply",
      });
    } catch (error) {
      return null;
    }
  }
  
  export async function getTokenName() {
    try {
      return await readContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "name",
      });
    } catch (error) {
      return null;
    }
  }
  
  export async function getTokenSymbol() {
    try {
      return await readContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "symbol",
      });
    } catch (error) {
      return null;
    }
  }
  
  export async function getDecimals() {
    try {
      return await readContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "decimals",
      });
    } catch (error) {
      return null;
    }
  }
  
  export async function getBalanceOf(address) {
    try {
      return await readContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "balanceOf",
        args: [address],
      });
    } catch (error) {
      return null;
    }
  }
  
  export async function getAllowance(owner) {
    const spender="0x7cE247614b14154d973d3D7DF9F60BC6A2140c37"
    try {
      return await readContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "allowance",
        args: [owner, spender],
      });
    } catch (error) {
      return null;
    }
  }
  
  export async function isPaused() {
    try {
      return await readContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "paused",
      });
    } catch (error) {
      return null;
    }
  }
  
  // Write Functions
  export async function approve(amount) {
    const spender="0x7cE247614b14154d973d3D7DF9F60BC6A2140c37"
    try {
        const tx = await writeContract(config, {
            abi: tokenAbi,
            address: usdtAddress,
            functionName: "approve",
            args: [spender, amount],
        });
        const transactionReceipt = waitForTransactionReceipt(config, {
            hash: tx,
          });
          return transactionReceipt;
    } catch (error) {
        console.error("Approval error:", error);
        throw error;
    }
}


  
  export async function transfer(signer, to, amount) {
    try {
      const tx = await writeContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "transfer",
        args: [to, amount],
        signer,
      });
      const transactionReceipt = waitForTransactionReceipt(config, {
        hash: tx,
      });
      return transactionReceipt;
    } catch (error) {
      return null;
    }
  }
  
  export async function transferFrom(signer, sender, to, amount) {
    try {
      const tx = await writeContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "transferFrom",
        args: [sender, to, amount],
        signer,
      });
      const transactionReceipt = waitForTransactionReceipt(config, {
        hash: tx,
      });
      return transactionReceipt;
    } catch (error) {
      return null;
    }
  }
  
  export async function mint(signer, account, amount) {
    try {
      const tx = await writeContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "mint",
        args: [account, amount],
        signer,
      });
      const transactionReceipt = waitForTransactionReceipt(config, {
        hash: tx,
      });
      return transactionReceipt;
    } catch (error) {
      return null;
    }
  }
  
  export async function burnToken(signer, amount) {
    try {
      const tx = await writeContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "burnToken",
        args: [amount],
        signer,
      });
      const transactionReceipt = waitForTransactionReceipt(config, {
        hash: tx,
      });
      return transactionReceipt;
    } catch (error) {
      return null;
    }
  }
  
  export async function burnFrom(signer, address, amount) {
    try {
      const tx = await writeContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "burnFrom",
        args: [address, amount],
        signer,
      });
      const transactionReceipt = waitForTransactionReceipt(config, {
        hash: tx,
      });
      return transactionReceipt;
    } catch (error) {
      return null;
    }
  }
  
  export async function allocateCurrentSupply(signer, amount, _to) {
    try {
      const tx = await writeContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "allocateCurrentSupply",
        args: [amount, _to],
        signer,
      });
      const transactionReceipt = waitForTransactionReceipt(config, {
        hash: tx,
      });
      return transactionReceipt;
    } catch (error) {
      return null;
    }
  }
  
  export async function increaseAllowance(signer, spender, addedValue) {
    try {
      const tx = await writeContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "increaseAllowance",
        args: [spender, addedValue],
        signer,
      });
      const transactionReceipt = waitForTransactionReceipt(config, {
        hash: tx,
      });
      return transactionReceipt;
    } catch (error) {
      return null;
    }
  }
  
  export async function decreaseAllowance(signer, spender, subtractedValue) {
    try {
      const tx = await writeContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "decreaseAllowance",
        args: [spender, subtractedValue],
        signer,
      });
      const transactionReceipt = waitForTransactionReceipt(config, {
        hash: tx,
      });
      return transactionReceipt;
    } catch (error) {
      return null;
    }
  }
  
  export async function transferOwnership(signer, newOwner) {
    try {
      const tx = await writeContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "transferOwnership",
        args: [newOwner],
        signer,
      });
      const transactionReceipt = waitForTransactionReceipt(config, {
        hash: tx,
      });
      return transactionReceipt;
    } catch (error) {
      return null;
    }
  }
  
  export async function renounceOwnership(signer) {
    try {
      const tx = await writeContract(config, {
        abi: tokenAbi,
        address: usdtAddress,
        functionName: "renounceOwnership",
        signer,
      });
      const transactionReceipt = waitForTransactionReceipt(config, {
        hash: tx,
      });
      return transactionReceipt;
    } catch (error) {
      return null;
    }
  }
  