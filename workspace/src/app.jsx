import React from "react";
import { SWRConfig } from "swr";
import { Helmet } from "react-helmet";
import ultraCache from "ultra/cache";
import a from "./test/a.js";

const options = (cache) => ({
  provider: () => ultraCache(cache),
  suspense: true,
});

const Ultra = ({ cache }) => {
  return (
    <SWRConfig value={options(cache)}>
      <Helmet>
        <link rel="stylesheet" href="/style.css" />
      </Helmet>
      <h1>Ultra</h1>
    </SWRConfig>
  );
};

export default Ultra;
