import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
  getAccount
} from "@wagmi/core";
import  config  from "../config/WagmiConfig.js";
import { contractAbi } from "./abi.js";
const contract = "0x7cE247614b14154d973d3D7DF9F60BC6A2140c37";
import { useAccount, useWalletClient } from "wagmi";

 // Get wallet status

// import Web3 from "web3";

// const web3 = new Web3("https://endpoints.omniatech.io/v1/bsc/mainnet/public");
// const contractInstance = new web3.eth.Contract(contractAbi, contract);
//   const tokenContract = new web3.eth.Contract(tokenAbi, Anxt);
// const { data: walletClient } = useWalletClient();

// import { injected } from 'wagmi/connectors';


export async function AmountOfHvtAccordingToBNB() {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "AmountOfHvtAccordingToBNB",
      args: [],
    });
  } catch (error) {
    return null;
  }
}

export async function HVT() {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "HVT",
      args: [],
    });
  } catch (error) {
    return null;
  }
}

export async function IsExistInBinary(address) {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "IsExistInBinary",
      args: [address],
    });
  } catch (error) {
    return null;
  }
}

export async function TotalIncome(address) {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "TotalIncome",
      args: [address],
    });
  } catch (error) {
    return null;
  }
}

export async function USDT() {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "USDT",
      args: [],
    });
  } catch (error) {
    return null;
  }
}

export async function addressToId(address) {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "addressToId",
      args: [address],
    });
  } catch (error) {
    return null;
  }
}

export async function blockOrRemoveUser(address) {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "blockOrRemoveUser",
      args: [address],
    });
  } catch (error) {
    return null;
  }
}

export async function idProvider() {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "idProvider",
      args: [],
    });
  } catch (error) {
    return null;
  }
}

export async function idToAddress(id) {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "idToAddress",
      args: [id],
    });
  } catch (error) {
    return null;
  }
}

export async function isExist(address) {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "isExist",
      args: [address],
    });
  } catch (error) {
    return null;
  }
}

export async function isExistInThird(address) {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "isExistInThird",
      args: [address],
    });
  } catch (error) {
    return null;
  }
}

export async function isUnlocked(address) {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "isUnlocked",
      args: [address],
    });
  } catch (error) {
    return null;
  }
}

export async function owner() {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "owner",
      args: [],
    });
  } catch (error) {
    return null;
  }
}

export async function secondIndexRunning() {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "secondIndexRunning",
      args: [],
    });
  } catch (error) {
    return null;
  }
}

export async function seconddMatrixUsers(address) {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "seconddMatrixUsers",
      args: [address],
    });
  } catch (error) {
    return null;
  }
}

export async function thirdIndexRunning() {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "thirdIndexRunning",
      args: [],
    });
  } catch (error) {
    return null;
  }
}

export async function thirdMatrixUsers(address) {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "thirdMatrixUsers",
      args: [address],
    });
  } catch (error) {
    return null;
  }
}

export async function userDetails(address) {
  try {
    return await readContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "userDetails",
      args: [address],
    });
  } catch (error) {
    return null;
  }
}

// Write functions
export async function AdminBuyStage(sponser, user, side, signer) {
  try {
    const tx = await writeContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "AdminBuyStage",
      args: [sponser, user, side],
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

export async function blockUnblockuser(user, status) {
  console.log('this is block function',user,status)
  try {
    const tx = await writeContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "blockUnblockuser",
      args: [user, status],
      
    });
    const transactionReceipt = waitForTransactionReceipt(config, {
      hash: tx,
    });
    console.log('this is transaction',transactionReceipt)
    return transactionReceipt;
  } catch (error) {
    return null;
  }
}

export async function buyStage(sponser, userAddress) {
  const value = "35000000000000004"; // 0.035 ETH in wei

  // console.log("buyStage inputs:", { sponser, userAddress, value });
  // console.log("Config:", config);

  // Validate inputs
  if (!sponser || sponser === "") {
    throw new Error("Sponsor address is invalid or empty");
  }
  if (!userAddress || userAddress === "") {
    throw new Error("User address is invalid or empty");
  }

  try {
    const tx = await writeContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "buyStage",
      args: [sponser],
      account: userAddress,
      value,
    });

    console.log("Transaction hash:", tx);

    const transactionReceipt = await waitForTransactionReceipt(config, {
      hash: tx,
    });

    console.log("Transaction receipt:", transactionReceipt);
    return transactionReceipt;
  } catch (error) {
    console.error("Error in buyStage:", error);
    throw error; // Re-throw to let toast.promise handle it
  }
}

export async function claimIncome(address) {
  try {
    const tx = await writeContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "claimIncome",
      args: [],
      account: address,
    });
    const transactionReceipt = waitForTransactionReceipt(config, {
      hash: tx,
    });
    return transactionReceipt;
  } catch (error) {
    return null;
  }
}

export async function rescueHVT(amt, signer) {
  try {
    const tx = await writeContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "rescueHVT",
      args: [amt],
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

export async function rescueUSDT(amt, signer) {
  try {
    const tx = await writeContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "rescueUSDT",
      args: [amt],
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

export async function unlockIncome() {
  try {
    const tx = await writeContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "unlockIncome",
      args: [],
    });
    const transactionReceipt = waitForTransactionReceipt(config, {
      hash: tx,
    });
    return transactionReceipt;
  } catch (error) {
    return null;
  }
}

export async function withdrawBNB(signer) {
  try {
    const tx = await writeContract(config, {
      abi: contractAbi,
      address: contract,
      functionName: "withdrawBNB",
      args: [],
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