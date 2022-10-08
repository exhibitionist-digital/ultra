import type { ReactNode } from "react";
import React, { createElement as h, Fragment } from "react";
import { renderToString } from "react-dom/server";
import ServerInsertedHTMLContext from "../../hooks/server-inserted-html-context.js";

const serverInsertedHTMLCallbacks: Set<() => ReactNode> = new Set();

export function InsertedHTML({ children }: { children: JSX.Element }) {
  // Reset flushEffectsHandler on each render
  serverInsertedHTMLCallbacks.clear();

  const addInsertedHTML = React.useCallback(
    (handler: () => ReactNode) => {
      serverInsertedHTMLCallbacks.add(handler);
    },
    [],
  );

  return (
    h(ServerInsertedHTMLContext.Provider, { value: addInsertedHTML }, children)
  );
}

export const getServerInsertedHTML = (): Promise<string> => {
  return Promise.resolve(renderToString(
    h(
      Fragment,
      null,
      Array.from(serverInsertedHTMLCallbacks).map((callback) => callback()),
    ),
  ));
};
