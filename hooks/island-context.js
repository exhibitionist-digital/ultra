import { createContext } from "react";

/**
 * @type {React.Context<(Component: React.ComponentType & { url: string }, props: any) => number>}
 */
const IslandContext = createContext(() => {});

export default IslandContext;
