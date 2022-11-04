import { createContext } from "react";

/**
 * @template T
 * @type {React.Context<null | (id: string, callback: () => Promise<T>) => void>}
 */
const DataStreamContext = createContext(
  null,
);

export default DataStreamContext;
