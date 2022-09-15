import { createElement as h } from "react";
import EnvContext from "../../hooks/env-context.js";
import useFlushEffects from "../../hooks/use-flush-effects.js";

export function EnvProvider({ children }: { children: JSX.Element }) {
  const env = Object.entries(Deno.env.toObject()).filter(([key]) =>
    key.startsWith("ULTRA_PUBLIC_")
  );

  const value = new Map<string, string>(env);

  useFlushEffects(() => {
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
