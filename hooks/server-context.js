import { createContext } from "react";

/**
 * @type {React.Context<import('../lib/types.ts').Context | undefined>}
 */
const ServerContext = createContext(undefined);

export default ServerContext;
