import { crayon, outdent } from "./lib/build/deps.ts";
import type { BuildOptions, BuildPlugin } from "./lib/build/types.ts";
import { UltraBuilder } from "./lib/build/ultra.ts";

/**
 * Re-export these types as convenience to build plugin authors
 */
export type { BuildPlugin };

export default function createBuilder(options: Partial<BuildOptions>) {
  return new UltraBuilder(options, (builder) => {
    // deno-fmt-ignore
    console.log(outdent`\n
      You can now deploy the "${crayon.lightBlue(builder.context.output)}" output directory to a platform of your choice.
      Instructions for common deployment platforms can be found at ${crayon.green('https://ultrajs.dev/docs#deploying')}.\n
      Alternatively, you can cd into "${crayon.lightBlue(builder.context.output)}" and run: ${crayon.underline("deno task start")}
    `);
  });
}
