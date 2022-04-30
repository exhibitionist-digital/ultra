import { transformCss } from "./css.ts";
import { assertEquals } from "../deps.dev.ts";

Deno.test({ name: "transformCss", only: true }, () => {
  const code = transformCss(
    `
    body {
      background-color: red;
      color: blue;

      & div {
        color: green;
      }
    }
  `,
    {
      output: {
        minify: true,
      },
    },
  );

  assertEquals(
    code,
    `body{color:#00f;background-color:red}body div{color:green}`,
  );
});
