import { Config } from "../config.ts";

export function denoConfigContent(config: Config) {
  return `
      {   
         "tasks": {
            "dev": "deno run -A --no-check --watch server${
    config.ts ? ".tsx" : ".jsx"
  }",
            "build": "deno run -A ./build${config.ts ? ".ts" : ".js"}",
            "start": "ULTRA_MODE=production deno run -A --no-remote server.js"
         },
         "compilerOptions": {
            "jsx": "react-jsxdev",
            "jsxImportSource": "react",
            "lib": ["deno.window", "dom"]
         },
         "importMap": "./importMap.json"
      }
   `;
}
