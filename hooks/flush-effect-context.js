import { createContext } from "react";

/**
 * @type {React.Context<null | (handler: () => React.ReactNode>)}
 */
const FlushEffectsContext = createContext(
  null,
);

export default FlushEffectsContext;
