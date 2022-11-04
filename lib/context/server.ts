import { createElement as h } from "react";
import ServerContext from "../../hooks/server-context.js";
import type { Context } from "../types.ts";

type ServerContextProviderProps = {
  children: JSX.Element;
  context: Context | undefined;
};

export function ServerContextProvider(
  { children, context }: ServerContextProviderProps,
) {
  return h(ServerContext.Provider, { value: context, children });
}
