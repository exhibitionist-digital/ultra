import React from "react";
import { CTX } from "./app.jsx";
export default () => {
  const getCtx = React.useContext(CTX);
  return (
    <div>
      <h2>component.jsx</h2>
      {getCtx}
    </div>
  );
};
