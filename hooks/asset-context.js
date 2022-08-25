import { createContext } from "react";

/**
 * @type {React.Context<undefined | Map<string, string>>}
 */
const AssetContext = createContext(undefined);

export default AssetContext;
