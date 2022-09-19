import type { Config } from "../../common/config.ts";

export function stitchesConfigContent(config: Config) {
  return `
import { createStitches } from "@stitches/react";
${config.ts ? 'import type * as Stitches from "@stitches/react";' : ""}

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      gray400: "gainsboro",
      gray500: "lightgray",
    },
    space: {
      0: "0em",
      1: "0.25em",
    },
  },
  media: {
    bp1: "(min-width: 480px)",
  },
  utils: {
    marginX: (value${
    config.ts ? ': Stitches.PropertyValue<"margin">' : ""
  }) => ({
      marginLeft: value,
      marginRight: value,
    }),
  },
});
   `;
}

export function stitchesProviderContent(config: Config) {
  return `
${config.ts ? 'import { PropsWithChildren } from "react";' : ""}
import useFlushEffects from "ultra/hooks/use-flush-effects.js";
import { getCssText } from "./stitches.config${config.ts ? ".ts" : ".js"}";

export function StitchesProvider({ children }${
    config.ts ? ": PropsWithChildren" : ""
  }) {
  /**
   * useFlushEffects will inject the returned output into the rendered stream.
   */
  useFlushEffects(() => {
    return (
      <style
        id="stitches"
        dangerouslySetInnerHTML={{ __html: getCssText() }}
      >
      </style>
    );
  });

  return <>{children}</>;
}
   `;
}
