import React from "react";

import { ultraFetch } from "@ultra/react";

const component = () => {
  const data = ultraFetch("/api/hello");
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default component;
