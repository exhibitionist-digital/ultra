import { Helmet, HelmetProvider } from "helmet";
import React from "react";

const Ultra = ({ helmetContext }) => {
  return (
    <HelmetProvider context={helmetContext}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charset="UTF-8" />
        <title>ULTRA</title>
      </Helmet>
      <main>
        <h1>hello world</h1>
      </main>
    </HelmetProvider>
  );
};

export default Ultra;
