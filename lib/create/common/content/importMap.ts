import { Config } from "../config.ts";
import { printer } from "../printer.ts";

export function importMapContent(config: Config) {
  const p = printer(config);
  return `
      {
         "imports": {
          "react": "https://esm.sh/react@18.2.0?dev",
          "react/": "https://esm.sh/react@18.2.0/",
          "react-dom": "https://esm.sh/react-dom@18.2.0",
          "react-dom/server": "https://esm.sh/react-dom@18.2.0/server?dev",
          "react-dom/client": "https://esm.sh/react-dom@18.2.0/client?dev",

            ${p.twind('"@twind/core": "https://esm.sh/@twind/core@1.0.1",')}
            ${
    p.twind(
      '"@twind/preset-autoprefix": "https://esm.sh/@twind/preset-autoprefix@1.0.1",',
    )
  }
            ${
    p.twind(
      '"@twind/preset-tailwind": "https://esm.sh/*@twind/preset-tailwind@1.0.1",',
    )
  }

            ${
    p.stitches(
      '"@stitches/react": "https://esm.sh/@stitches/react@1.2.8?external=react",',
    )
  }

            ${
    p.reactRouter(
      '"react-router-dom": "https://esm.sh/react-router-dom@6.3.0?external=react",',
    )
  }
            ${
    p.reactRouter(
      '"react-router-dom/server": "https://esm.sh/react-router-dom@6.3.0/server?external=react",',
    )
  }

            ${
    p.wouter('"wouter": "https://esm.sh/wouter@2.9.2?external=react",')
  }
            ${
    p.wouter(
      '"wouter/static-location": "https://esm.sh/wouter@2.9.2/static-location?external=react",',
    )
  }

            ${
    p.reactQuery(
      '"@tanstack/react-query": "https://esm.sh/@tanstack/react-query@4.2.3?external=react",',
    )
  }

            ${
    p.reactHelmetAsync(
      '"react-helmet-async": "https://esm.sh/react-helmet-async@1.3.0?external=react",',
    )
  }

            "ultra/": "https://deno.land/x/ultra@vy/"
         }
    }
   `;
}
