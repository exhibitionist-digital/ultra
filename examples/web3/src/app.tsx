import { Helmet } from "helmet";
import React, { useEffect, useState } from "react";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import type { ExternalProvider } from "@ethersproject/providers";

const injected = new InjectedConnector({});

const Dapp = () => {
  const { activate, active, account: address, library: provider } =
    useWeb3React<Web3Provider>();
  const [chainId, setChainId] = useState(1);

  useEffect(() => {
    provider.getNetwork(({ chainId }: { chainId: number }) =>
      setChainId(chainId)
    );
  }, [provider]);

  return (
    <div>
      {active
        ? (
          <div>
            <p>Connected address: {address}</p>
            <p>Current network ID: {chainId}</p>
          </div>
        )
        : (
          <button onClick={() => activate(injected)}>
            Connect with MetaMask
          </button>
        )}
    </div>
  );
};

const getLibrary = (provider: ExternalProvider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;

  return library;
};

const Ultra = () => {
  return (
    <div>
      <Helmet>
        <title>ULTRA</title>
      </Helmet>
      <Web3ReactProvider getLibrary={getLibrary}>
      </Web3ReactProvider>
    </div>
  );
};

export default Ultra;
