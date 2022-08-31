import { Config } from "../config.ts";
import { printer } from "../printer.ts";

export function importMapContent(config: Config) {
  const p = printer(config);
  function trpc(content:string){
   if(config.includes.includes('trpc')) return ''
   return content
  } 
  return `
      {
         "imports": {
            "react": "https://esm.sh/react@18.2.0${trpc('?dev')}",
            "react/": "https://esm.sh/react@18.2.0/",
            "react-dom": "https://esm.sh/react-dom@18.2.0",
            "react-dom/server": "https://esm.sh/react-dom@18.2.0/server${trpc('?dev')}",
            "react-dom/client": "https://esm.sh/react-dom@18.2.0/client${trpc('?dev')}",

            ${p.twind('"twind": "https://esm.sh/twind@0.16.17",')}
            ${p.twind('"twind/sheets": "https://esm.sh/twind@0.16.17/sheets",')}
            ${p.twind('"create-ultra-app/twind": "https://raw.githubusercontent.com/B3nten/create-ultra-app/main/src/modules/twind/index.ts",')}

            ${p.stitches('"@stitches/react": "https://esm.sh/@stitches/react@1.2.8?external=react",')}
            ${p.stitches('"create-ultra-app/stitches": "https://raw.githubusercontent.com/B3nten/create-ultra-app/main/src/modules/stitches/index.ts",')}

            ${p.reactRouter('"react-router-dom": "https://esm.sh/react-router-dom@6.3.0?external=react",')}
            ${p.reactRouter('"react-router-dom/server": "https://esm.sh/react-router-dom@6.3.0/server?external=react",')}

            ${p.wouter('"wouter": "https://esm.sh/wouter?external=react",')}
            ${p.wouter('"wouter/static-location": "https://esm.sh/wouter/static-location?external=react",')}
            ${p.wouter('"create-ultra-app/wouter": "https://raw.githubusercontent.com/B3nten/create-ultra-app/main/src/modules/wouter/index.tsx",')}

            ${p.reactQuery('"@tanstack/react-query": "https://esm.sh/@tanstack/react-query@4.2.3",')}
            ${p.reactQuery('"create-ultra-app/react-query": "https://raw.githubusercontent.com/B3nten/create-ultra-app/main/src/modules/react-query/index.ts",')}
            
            ${p.reactHelmetAsync('"react-helmet-async": "https://esm.sh/react-helmet-async@1.3.0?external=react",')}

            ${p.trpc(`
            "@trpc/client": "https://esm.sh/@trpc/client@next",
            "@trpc/server": "https://esm.sh/@trpc/server@next",
            "@trpc/server/": "https://esm.sh/v82/@trpc/server@next/",
            "@trpc/react": "https://esm.sh/@trpc/react@next",
            "zod": "https://esm.sh/zod@3.18.0",
            `)}

            "ultra/": "https://deno.land/x/ultra@v2.0.0-alpha.18/"
         }
    }
   `;
}
