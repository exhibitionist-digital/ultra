import { Config } from "../config.ts";
import { fileExtension } from "../io.ts";

export function denoConfigContent(config: Config) {
   const ext = fileExtension(config)
  return `{
   "tasks": {
     "dev": "deno run -A --no-check --watch ${ext('./server', true)}",
     "test": "deno test --allow-all",
     "build": "deno run -A ${ext('./build', false)}",
     "start": "ULTRA_MODE=production deno run -A --no-remote ./server.js"
   },
   "compilerOptions": {
     "jsx": "react-jsxdev",
     "jsxImportSource": "react"
   },
   "importMap": "./importMap.json"
 }`;
}
