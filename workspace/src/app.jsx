import React, { useEffect, useState } from "react";
import { SWRConfig } from "swr";
import { Helmet } from "react-helmet";
import ultraCache from "ultra/cache";

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
