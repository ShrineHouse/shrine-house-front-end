import Web3 from "web3";

let web3: any;

function init() {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // We are in the browser and metamask is running.
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
  } else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
      // "https://rinkeby.infura.io/v3/15c1d32581894b88a92d8d9e519e476c"
      "https://polygon-mumbai.infura.io/v3/d6686c4eeeaf46c494389a2279197442"
    );
    web3 = new Web3(provider);
  }
}

export async function getWallets() {
  let initialized = await init();
  const accounts = await web3.eth.getAccounts();
  return accounts;
}

export default web3;
