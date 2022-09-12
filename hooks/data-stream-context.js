import { createContext } from "react";

/**
 * @type {React.Context<null | (id: string, promise: Promise<any>) => void>}
 */
const DataStreamContext = createContext(
  null,
);

export default DataStreamContext;
