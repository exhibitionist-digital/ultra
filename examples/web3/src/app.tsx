import { Helmet } from "react-helmet";
import React, { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import type { ExternalProvider } from "@ethersproject/providers";

declare global {
  interface Window {
    ethereum: ExternalProvider & { enable: () => void } & EventEmitter;
  }
}

const Ultra = () => {
  const [provider, setProvider] = useState<Web3Provider>();
  const [address, setAddress] = useState("");

  useEffect(() => {
    window.ethereum?.on("accountsChanged", ([addr]) => {
      setAddress(addr);
    });
    if (window.ethereum) {
      setProvider(new Web3Provider(window.ethereum, "any"));
    }
  }, [window.ethereum]);

  const getAddress = async () => {
    const [addr] = await provider?.send("eth_accounts", []);

    return addr;
  };

  useEffect(() => {
    if (provider) getAddress().then(setAddress);
  }, [provider]);

  return (
    <div>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta charSet="UTF-8" />
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
        {address &&
          (
            <p>
              Connected to <code>{address}</code>
            </p>
          )}
        {!address && (
          <button
            onClick={() => {
              window.ethereum?.enable();
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
