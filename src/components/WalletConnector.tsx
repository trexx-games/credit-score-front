"use client";

import { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useWallet } from "@/context/WalletContext";

// Mutation para enviar o endereço da carteira, assinatura e mensagem
const SEND_WALLET_DETAILS = gql`
  mutation walletCreate(
    $address: String!
    $signature: String!
    $message: String!
  ) {
    walletCreate(
      input: { address: $address, signature: $signature, message: $message }
    ) {
      address
    }
  }
`;

export default function WalletConnector() {
  const { walletAddress, setWalletAddress } = useWallet();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [walletCreate, { loading }] = useMutation(SEND_WALLET_DETAILS, {
    onCompleted: (data) => {
      console.log("Mutation Response:", data);
    },
    onError: (error) => {
      console.error("Mutation Error:", error.message);
    },
  });

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        setWalletAddress(address);

        // Mensagem a ser assinada
        const message = `Please verify your wallet address: ${address}`;

        // Solicita a assinatura da mensagem
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, address],
        });

        // Envia a mutation com os dados
        walletCreate({
          variables: {
            address,
            signature,
            message,
          },
        });
      } catch (error) {
        setErrorMessage("Failed to connect wallet or sign message");
        console.error("Error:", error);
      }
    } else {
      setErrorMessage("MetaMask is not installed");
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) setWalletAddress(accounts[0]);
      }
    };
    checkConnection();
  }, []);

  return (
    <div className="flex items-center justify-center flex-col">
      <button
        onClick={connectWallet}
        className="px-4 py-2 bg-[#3E894F] text-white rounded hover:bg-[#66E383] transition mb-2"
        disabled={loading}
      >
        {walletAddress ? "Carteira Conectada" : "Conectar Carteira"}
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}
