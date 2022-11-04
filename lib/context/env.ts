import { createElement as h } from "react";
import EnvContext from "../../hooks/env-context.js";
import useServerInsertedHTML from "../../hooks/use-server-inserted-html.js";

export function EnvProvider({ children }: { children: JSX.Element }) {
  const env = Object.entries(Deno.env.toObject()).filter(([key]) =>
    key.startsWith("ULTRA_PUBLIC_")
  );

  const value = new Map<string, string>(env);

  useServerInsertedHTML(() => {
    const entries = Array.from(value.entries());
    if (!entries.length) {
      return null;
    }

    return (
      h("script", {
        type: "text/javascript",
        dangerouslySetInnerHTML: {
          __html: `globalThis.__ULTRA_ENV = ${
            JSON.stringify(Array.from(value.entries()))
          }`,
        },
      })
    );
  });

  return h(EnvContext.Provider, { value }, children);
}
