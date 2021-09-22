import { Helmet } from "helmet";
import React, { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import type { ExternalProvider } from "@ethersproject/providers";

declare global {
  interface Window {
    ethereum: ExternalProvider & { enable: () => void };
  }
}

const Ultra = () => {
  const [provider, setProvider] = useState<Web3Provider>();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new Web3Provider(window.ethereum));
    }
  }, [window.ethereum]);

  useEffect(() => {
    if (provider) {
      provider?.send("eth_accounts", []).then(setAddress);
    }
  }, [provider]);

  return (
    <div>
      {provider
        ? (
          <p>
            Connected to <code>{address}</code>
          </p>
        )
        : (
          <button
            onClick={() => {
              if (window.ethereum) {
                window.ethereum.enable();

                provider?.send("eth_accounts", []).then(setAddress);
              }
            }}
          >
            Connect wallet
          </button>
        )}
    </div>
  );
};

export default Ultra;
