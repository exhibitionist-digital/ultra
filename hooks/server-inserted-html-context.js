import React from "react";

/**
 * @type {React.Context<null | (handler: () => React.ReactNode>)}
 */
const ServerInsertedHTMLContext = React.createContext(
  null,
);

export default ServerInsertedHTMLContext;
