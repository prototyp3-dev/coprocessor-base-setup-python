"use client";

import { useState } from "react";
import { connectWalletClient, connectPublicClient } from "@/utils/utils";
import { formatEther } from 'viem'

export default function WalletButton() {
  // State variables to store the wallet address and balance
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  // Function to handle the button click event
  async function handleClick() {
    try {
      // Instantiate a Wallet Client and a Public Client
      const walletClient = await connectWalletClient();
      const publicClient = connectPublicClient();

      // Retrieve the wallet address using the Wallet Client
      const [currAddress] = await walletClient.requestAddresses();
      // const [address] = await walletClient.getAddresses();

      // if (address) {
      //   return;
      // }

      // Retrieve the balance of the address using the Public Client
      const currBalance = parseFloat(formatEther(await publicClient.getBalance({ address:currAddress }))).toLocaleString("en", { maximumFractionDigits: 4 });

      // Update the state variables with the retrieved address and balance
      setAddress(currAddress);
      setBalance(currBalance);
    } catch (error) {
      // Error handling: Display an alert if the transaction fails
      alert(`Transaction failed: ${error}`);
    }
  }

  return (
    <>
      <button
        className="px-8 py-2 rounded-md bg-gray-200 border border-gray-100 hover:bg-gray-100 shadow-md shadow-gray-50/10"
        onClick={handleClick}
      >
        { !address ?
          <h1 className="mx-auto">Connect Wallet</h1>
          :
          <Status address={address} balance={balance} />
        }
      </button>
    </>
  );
}

// Component to display the wallet status (connected or disconnected)
function Status({
  address,
  balance,
}: {
  address: string | null;
  balance: string | null;
}) {
  if (!address) {
    // If no address is provided, display "Disconnected" status
    return (
      <div className="flex items-center">
        <div className="border bg-red-600 border-red-600 rounded-full w-1.5 h-1.5 mr-2">
        </div>
        <div>Disconnected</div>
      </div>
    );
  }

  // If an address is provided, display the address and balance
  return (
    <div className="flex items-center w-full">
      <div className="border bg-green-500 border-green-500 rounded-full w-1.5 h-1.5 mr-2"></div>
      <div className="text-xs md:text-xs">{address.substring(0,6)}...{address.substring(address.length-4,address.length)} <br />{balance} ETH</div>
    </div>
  );
}
