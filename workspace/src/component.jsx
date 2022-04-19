import React from "react";
import { CTX } from "./app.jsx";

export default () => {
  const getCtx = React.useContext(CTX);
  return (
    <div>
      <h1>Ultra</h1>
      <h2>{getCtx}</h2>
    </div>
  );
};
