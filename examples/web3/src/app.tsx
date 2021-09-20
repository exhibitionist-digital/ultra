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
  const [provider, set] = useState<Web3Provider>();

  useEffect(() => {
    if (window.ethereum) {
      set(new Web3Provider(window.ethereum));
    }
  }, []);

  return (
    <div>
      <Helmet>
        <title>ULTRA</title>
      </Helmet>
    </div>
  );
};

export default Ultra;
