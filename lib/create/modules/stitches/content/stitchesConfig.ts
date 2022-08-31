import { Config } from '../../../common/config.ts'

export function stitchesConfigContent(config: Config) {
	return `
   import { createStitches } from "@stitches/react";
${config.ts? 'import type * as Stitches from "@stitches/react";' : ''}

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
    ${config.ts ? 'marginX: (value: Stitches.PropertyValue<"margin">) => ({' : 'marginX: (value) => ({'}
      marginLeft: value,
      marginRight: value,
    }),
  },
});

   `
}
