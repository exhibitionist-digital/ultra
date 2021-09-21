import { Helmet } from "helmet";
import React, { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import type { ExternalProvider } from "@ethersproject/providers";

declare global {
  interface Window {
    ethereum: ExternalProvider;
  }
}

const Ultra = () => {
  const [provider, setProvider] = useState<Web3Provider>();

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new Web3Provider(window.ethereum));
    }
  }, [window.ethereum]);

  return (
    <div>
      <button
        onClick={() => {
          provider?.send("eth_accounts", []);
        }}
      >
        Connect wallet
      </button>
    </div>
  );
};

export default Ultra;
