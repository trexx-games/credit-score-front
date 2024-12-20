export const isMetamaskInstalled = () => {
  return typeof window.ethereum !== "undefined";
};

export const getWalletAddress = async () => {
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  return accounts[0] || null;
};

export const requestWalletConnection = async () => {
  return await window.ethereum.request({ method: "eth_requestAccounts" });
};
