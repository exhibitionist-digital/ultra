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
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="/style.css?web3" />
        <title>Ultra</title>
        <meta
          name="description"
          content="Web3 Starter"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://ultrajs.dev/logo.svg"
        />
      </Helmet>
      <main>
        {!!address?.length &&
          (
            <p>
              Connected to <code>{address}</code>
            </p>
          )}
        {!address?.length && (
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
      </main>
    </div>
  );
};

export default Ultra;
