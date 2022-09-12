import { createContext } from "react";

/**
 * @type {React.Context<null | (callback: () => Promise<void>)>}
 */
const AsyncEffectContext = createContext(
  null,
);

export default AsyncEffectContext;
