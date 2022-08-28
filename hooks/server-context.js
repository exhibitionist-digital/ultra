import { createContext } from "react";

/**
 * @type {React.Context<undefined | import('../lib/types.ts').Context>}
 */
const ServerContext = createContext(undefined);

export default ServerContext;
