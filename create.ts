import question from "https://raw.githubusercontent.com/ocpu/question-deno/master/mod.ts";
import {
  brightBlue,
  green,
  underline,
  yellow,
} from "https://deno.land/std@0.153.0/fmt/colors.ts";
import { dirname, join } from "https://deno.land/std@0.153.0/path/mod.ts";
import outdent from "https://deno.land/x/outdent@v0.8.0/mod.ts";
import { ensureDir } from "https://deno.land/std@0.153.0/fs/ensure_dir.ts";

type Dialect = "ts" | "js";

type TaskContext = {
  cwd: string;
  output: string;
  overwrite?: boolean;
  dialect: Dialect;
};

type TaskUtils = {
  dialectFilename: (filename: string, isJsk?: boolean) => string;
};

const config = {
  projectName: "my-ultra-project",
  twind: true,
  emotion: false,
  stitches: false,
  reactQuery: true,
  helmet: true,
  reactRouter: true,
  wouter: false,
  typescript: true,
  style: "Twind",
  router: "React-Router",
  head: "",
};

/*
INTRO CONTENT
*/

console.log(`
▄• ▄▌▄▄▌  ▄▄▄▄▄▄▄▄   ▄▄▄· 
█▪██▌██•  •██  ▀▄ █·▐█ ▀█ 
█▌▐█▌██▪   ▐█.▪▐▀▀▄ ▄█▀▀█ 
▐█▄█▌▐█▌▐▌ ▐█▌·▐█•█▌▐█ ▪▐▌
 ▀▀▀ .▀▀▀  ▀▀▀ .▀  ▀ ▀  ▀ 
`);
console.log(outdent`
    Welcome to Ultra\n
    Let's get you setup with your new Ultra project.\n
    But first, we need to ask just a few questions.\n
  `);

/*
PROJECT QUESTIONS
*/

const projectName = (await question(
  "input",
  "What is the name of your project?",
  "my-ultra-project",
));
projectName ? config.projectName = projectName : null;

// const useDefault = await question(
//   "confirm",
//   "Do you want to use the default configuration?",
//   true,
// );

// if (useDefault === true) {
//   console.log("Using default configuration...");
//   await createUltraApp();
// }

const typescript = await question(
  "confirm",
  "Do you want to use typescript?",
  true,
);
typescript ? config.typescript = true : config.typescript = false;

const style = await question("list", "Select a style library", [
  "Twind",
  "Emotion",
  "Stitches",
  "None",
]);

const router = await question("list", "Select a routing library", [
  "React Router",
  "Wouter",
  "None",
]);

const head = await question("list", "Select a head management library", [
  "React Helmet",
  "None",
]);

const query = await question("list", "Select a query library", [
  "React Query",
  "None",
]);

config.emotion = style === "Emotion";
config.stitches = style === "Stitches";
config.twind = style === "Twind";
config.reactRouter = router === "React Router";
config.helmet = head === "React Helmet";
config.reactQuery = query === "React Query";
config.wouter = router === "Wouter";

const context: TaskContext = {
  cwd: Deno.cwd(),
  output: config.projectName,
  overwrite: false,
  dialect: config.typescript ? "ts" : "js",
};

const utils: TaskUtils = {
  dialectFilename(filename: string, isJsx?: boolean) {
    const extension = dialectExtension(config.typescript ? "ts" : "js", isJsx);
    return `${filename}.${extension}`;
  },
};

async function execute(context: TaskContext, utils: TaskUtils) {
  const tasks = taskQueue([
    createFileTask("deno.json", denoConfigContent(utils)),
    createFileTask("importMap.json", importMapContent()),
    createFileTask(utils.dialectFilename("build"), buildContent()),
    createFileTask(utils.dialectFilename("server", true), serverContent()),
    createFileTask(utils.dialectFilename("client", true), clientContent()),
    createFileTask(utils.dialectFilename("src/app", true), helloUltraContent()),
    fetchFileTask(
      "public/favicon.ico",
      import.meta.resolve(
        "https://github.com/exhibitionist-digital/ultra/blob/main/examples/basic/public/favicon.ico",
      ),
    ),
    fetchFileTask(
      "public/robots.txt",
      import.meta.resolve(
        "https://github.com/exhibitionist-digital/ultra/blob/main/examples/basic/public/robots.txt",
      ),
    ),
    createFileTask("public/style.css", styleContent()),
  ]);

  for (const task of tasks) {
    await task(context);
  }
}

function createFileTask(path: string, content: string | Uint8Array) {
  return async (context: TaskContext) => {
    let overwritten = false;
    path = join(context.cwd, context.output, path);

    if (!context.overwrite && (await exists(path))) {
      const confirmed = await confirm(
        yellow(
          `DANG: A file at "${path}" already exists, do you want to overwrite it?`,
        ),
      );

      if (!confirmed) {
        return Promise.resolve();
      }

      overwritten = true;
    }

    await ensureDir(dirname(path));

    await Deno.writeFile(
      path,
      typeof content === "string" ? new TextEncoder().encode(content) : content,
    );

    if (!overwritten && !context.overwrite) {
      console.log(`${green("✔️  Created:")} ${path}`);
    } else {
      console.log(`${yellow("✔️  Modifed:")} ${path}`);
    }
  };
}

function fetchFileTask(path: string, url: string) {
  return async (context: TaskContext) => {
    const response = await fetch(url);
    const content = await response.arrayBuffer();
    console.log(`${green("✔️  Fetched:")} ${url}`);

    const createFile = createFileTask(path, new Uint8Array(content));

    return createFile(context);
  };
}

function* taskQueue(tasks: ((context: TaskContext) => Promise<void>)[]) {
  let iterationCount = 0;

  for (let i = 0; i < tasks.length; i++) {
    iterationCount++;
    yield tasks[i];
  }

  return iterationCount;
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await Deno.lstat(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }

    throw err;
  }
}

function insertContent(shouldInsert: boolean, content: string) {
  if (shouldInsert) return content;
  return "";
}

function denoConfigContent(utils: TaskUtils) {
  const serverEntrypoint = utils.dialectFilename("./server", true);
  // deno-fmt-ignore
  return outdent`
    {
      "tasks": {
        "dev": "deno run -A --no-check --watch ${serverEntrypoint}",
        "build": "deno run -A ./build.ts",
        "start": "ULTRA_MODE=production deno run -A --no-remote ${serverEntrypoint}"
      },
      "compilerOptions": {
        "jsx": "react-jsxdev",
        "jsxImportSource": "react",
        "lib": ["deno.window", "dom"]
      },
      "importMap": "./importMap.json"
    }
  `
}

function importMapContent() {
  return outdent`
  {
     "imports": {
       "react": "https://esm.sh/react@18.2.0",
       "react/": "https://esm.sh/react@18.2.0/",
       "react-dom": "https://esm.sh/react-dom@18.2.0",
       "react-dom/": "https://esm.sh/react-dom@18.2.0/",
       ${
    insertContent(
      config.twind,
      `
       "twind": "https://esm.sh/twind@0.16.17",
       "twind/sheets": "https://esm.sh/twind@0.16.17/sheets",
       "@create-ultra-app/twind": "https://raw.githubusercontent.com/B3nten/create-ultra-app/main/src/twind/index.tsx",
       `,
    )
  }
       ${
    insertContent(
      config.emotion,
      `
       "@emotion/react": "https://esm.sh/@emotion/react@11.10.0?external=react",
       "@emotion/styled": "https://esm.sh/@emotion/styled@11.10.0?external=react,@emotion/react",
       `,
    )
  }
       ${
    insertContent(
      config.stitches,
      `
       "@stitches/react": "https://esm.sh/@stitches/react@1.2.8?external=react",
       "@create-ultra-app/stitches": "https://raw.githubusercontent.com/B3nten/create-ultra-app/main/src/stitches/index.tsx",
       `,
    )
  }
       ${
    insertContent(
      config.reactQuery,
      `
       "@tanstack/react-query": "https://esm.sh/@tanstack/react-query@4.1.3?external=react",
       "@create-ultra-app/react-query": "https://raw.githubusercontent.com/B3nten/create-ultra-app/main/src/react-query/index.tsx",
       `,
    )
  }
       ${
    insertContent(
      config.helmet,
      `
       "react-helmet-async": "https://esm.sh/react-helmet-async@1.3.0?external=react",
       `,
    )
  }
       ${
    insertContent(
      config.reactRouter,
      `
       "react-router-dom": "https://esm.sh/react-router-dom@6.3.0?external=react",
       "react-router-dom/server": "https://esm.sh/react-router-dom@6.3.0/server?external=react",
       `,
    )
  }
       ${
    insertContent(
      config.wouter,
      `
       "wouter": "https://esm.sh/wouter?external=react",
       "wouter/static-location": "https://esm.sh/wouter/static-location?external=react",
      "@create-ultra-app/wouter": "https://raw.githubusercontent.com/B3nten/create-ultra-app/main/src/wouter/index.tsx"
       `,
    )
  }
       "ultra/": "https://deno.land/x/ultra/",
     }
   }
   `;
}

function buildContent() {
  // deno-fmt-ignore
  return outdent`
  import { createBuilder } from "ultra/build.ts";

  const builder = createBuilder({
    browserEntrypoint: import.meta.resolve("./client.tsx"),
    serverEntrypoint: import.meta.resolve("./server.tsx"),
  });
  
  builder.setExcluded([
    "./README.md",
  ]);
  
  // deno-lint-ignore no-unused-vars
  const result = await builder.build();
  `
}

function serverContent() {
  // deno-fmt-ignore
  return outdent`
  import { serve } from 'https://deno.land/std@0.153.0/http/server.ts'
  import { createServer } from 'ultra/server.ts'
  import App from './src/app.tsx'
  ${insertContent(
		config.stitches,
		`
  //stitches
  import {StitchesProvider} from '@create-ultra-app/stitches'
  import { getCssText } from "./stitches.config.ts";
  `
  )}
  ${insertContent(
		config.twind,
		`
  //twind
  import { TwindProvider, sheet } from '@create-ultra-app/twind'
  import './twind.tsx'
  `
  )}
  ${insertContent(
		config.reactQuery,
		`
  //react-query
  import { QueryClientProvider } from '@tanstack/react-query'
  import { useDehydrateReactQuery, queryClient } from '@create-ultra-app/react-query'
  `
  )}
  ${insertContent(
		config.helmet,
		`
  //react-helmet-async
  import { HelmetProvider } from 'react-helmet-async'
  import useFlushEffects from 'ultra/hooks/use-flush-effects.js'
  // deno-lint-ignore no-explicit-any
  ${config.typescript ? 'const helmetContext: Record<string, any> = {}' : 'const helmetContext = {}' }
  `
  )}
  ${insertContent(
		config.reactRouter,
		`
  //react-router
  import { StaticRouter } from 'react-router-dom/server'
  `
  )}
  ${insertContent(
		config.wouter,
		`
  //wouter
  import { Router } from 'wouter'
  import staticLocationHook from 'wouter/static-location'
  import { SearchParamsProvider } from "@create-ultra-app/wouter"
  `
  )}
  
  const server = await createServer({
    importMapPath: import.meta.resolve('./importMap.json'),
    browserEntrypoint: import.meta.resolve('./client.tsx'),
  })
  ${config.typescript ? 'function ServerApp({ context }: { context: any }) {' : 'function ServerApp({ context }) {' }
     ${insertContent(
			config.reactQuery,
			`
     useDehydrateReactQuery(queryClient)
     `
		)}
     ${insertContent(
			config.helmet,
			`
    useFlushEffects(() => {
      const { helmet } = helmetContext
      return (
        <>
          {helmet.title.toComponent()}
          {helmet.priority.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {helmet.script.toComponent()}
        </>
      )
    })`
		)}
    const requestUrl = new URL(context.req.url)
    return (
        ${insertContent(
				config.helmet,
				`
        <HelmetProvider context={helmetContext}>
        `
			)}
        ${insertContent(
				config.reactQuery,
				`
        <QueryClientProvider client={queryClient}>
        `
			)}
        ${insertContent(
				config.stitches,
				`
        <StitchesProvider cssText={getCssText}>
        `
			)}
        ${insertContent(
				config.twind,
				`
        <TwindProvider sheet={sheet}>
        `
			)}
        ${insertContent(
				config.reactRouter,
				`
        <StaticRouter location={requestUrl.pathname}>
        `
			)}
        ${insertContent(
				config.wouter,
				`
        <Router hook={staticLocationHook(requestUrl.pathname)}>
        <SearchParamsProvider value={requestUrl.searchParams}>
        `
			)}
      <App />
      ${insertContent(
			config.wouter,
			`
        </SearchParamsProvider>
        </Router>
        `
		)}						
      ${insertContent(
			config.reactRouter,
			`
        </StaticRouter>
        `
		)}					
        ${insertContent(
				config.twind,
				`
        </TwindProvider>
        `
			)}
      ${insertContent(
			config.stitches,
			`
        </StitchesProvider>
        `
		)}
        ${insertContent(
				config.reactQuery,
				`
        </QueryClientProvider>
        `
			)}
      ${insertContent(
			config.helmet,
			`
        </HelmetProvider>
        `
		)}	
    )
  }
  
  server.get('*', async context => {
     ${insertContent(config.reactQuery, `queryClient.clear()`)}
  
    const result = await server.render(<ServerApp context={context} />)
  
    return context.body(result, 200, {
      'content-type': 'text/html',
    })
  })
  
  serve(server.fetch)
  `
}

function clientContent() {
  // deno-fmt-ignore
  return outdent`import { hydrateRoot } from 'react-dom/client'
  import App from './src/app.tsx'
  ${insertContent(
		config.twind,
		`
  //twind
  import { TwindProvider, sheet } from '@create-ultra-app/twind'
  import './twind.tsx'
  `
  )}
  ${insertContent(
		config.stitches,
		`
  //stitches
  import { StitchesProvider } from '@create-ultra-app/stitches'
  import { getCssText } from "./stitches.config.ts";
  `
  )}
  ${insertContent(
		config.reactQuery,
		`
  // react-query
  import { Hydrate, QueryClientProvider } from '@tanstack/react-query'
  import { queryClient } from '@create-ultra-app/react-query'
  ${config.typescript ? 'declare const __REACT_QUERY_DEHYDRATED_STATE: unknown':''}
  `
  )}
  ${insertContent(
		config.helmet,
		`
  //helmet
  import { HelmetProvider } from 'react-helmet-async'
  `
  )}
  ${insertContent(
		config.reactRouter,
		`
  //react-router
  import { BrowserRouter } from 'react-router-dom'
  `
  )}
  
  hydrateRoot(
    document,
     ${insertContent(
			config.helmet,
			`
     <HelmetProvider>
     `
		)}
    ${insertContent(
			config.reactQuery,
			`
         <QueryClientProvider client={queryClient}>
        <Hydrate state={__REACT_QUERY_DEHYDRATED_STATE}>
     `
		)}
     ${insertContent(
			config.stitches,
			`
     <StitchesProvider cssText={getCssText}>
     `
		)}
     ${insertContent(
			config.twind,
			`
     <TwindProvider sheet={sheet}>
     `
		)}					
    ${insertContent(
			config.reactRouter,
			`
     <BrowserRouter>
     `
		)}
    <App />
    ${insertContent(
			config.reactRouter,
			`
     </BrowserRouter>
     `
		)}	
     ${insertContent(
			config.twind,
			`
     </TwindProvider>
     `
		)}
     ${insertContent(
			config.stitches,
			`
     </StitchesProvider>
     `
		)}
    ${insertContent(
			config.reactQuery,
			`
     </Hydrate>
     </QueryClientProvider>
     `
		)}		
    ${insertContent(
			config.helmet,
			`
     </HelmetProvider>
     `
		)}	
  )`
}

function twindContent() {
  return outdent`
  import { sheet } from '@create-ultra-app/twind'
  import { setup } from "twind";

  /**
   * Your theme configuration for twind
  */

  const theme = {};

  setup({ sheet, theme });
  `;
}

function stitchesContent() {
  return outdent`
  import { createStitches } from "@stitches/react";
  import type * as Stitches from "@stitches/react";

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
      marginX: (value: Stitches.PropertyValue<"margin">) => ({
        marginLeft: value,
        marginRight: value,
      }),
    },
  });
  `;
}

function styleContent() {
  // deno-fmt-ignore
  return outdent`
    html,
    body {
      margin: 0;
      padding: 1rem;
      font-family: monospace;
      background: #ddd;
      text-align: center;
    }
    
    h1 {
      text-align: center;
      margin: 1rem auto 3rem;
      font-size: clamp(2em, 10vw, 8em);
      font-weight: 400;
    }
    
    h1 span::before {
      content: '@';
      animation: blink 3s infinite;
    }
    
    @keyframes blink {
    
      0%,
      50%,
      70%,
      95% {
        content: '@';
      }
    
      65%,
      90% {
        content: '—';
      }
    }
    
    p {
      max-width: 600px;
      margin: 0 auto 1em;
    }
  `
}

function helloUltraContent() {
  // deno-fmt-ignore
  return outdent`
    export default function App() {
      console.log("Hello world!");
      return (
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <title>Ultra</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="stylesheet" href="/style.css" />
          </head>
          <body>
            <main>
              <h1>
                <span></span>__<span></span>
              </h1>
              <p>
                Welcome to{" "}
                <strong>Ultra</strong>. This is a barebones starter for your web
                app.
              </p>
            </main>
          </body>
        </html>
      );
    }
  `
}

function dialectExtension(dialect: Dialect, isJsx?: boolean) {
  switch (dialect) {
    case "js":
      return isJsx ? "jsx" : "js";
    case "ts":
      return isJsx ? "tsx" : "ts";
  }
}

async function createUltraApp() {
  await execute(context, utils);
  const stitchesgen = createFileTask(
    utils.dialectFilename("stitches.config", true),
    stitchesContent(),
  );
  if (config.stitches) await stitchesgen(context);
  const twindcontent = createFileTask(
    utils.dialectFilename("twind", true),
    twindContent(),
  );
  if (config.twind) await twindcontent(context);
  await Deno.run({ cmd: ["deno", "fmt", `${config.projectName}/`] }).status();
  console.log(outdent`
  \n 🎉 BONZA! Your new Ultra project is ready, you can now cd into "${
    brightBlue(
      config.projectName,
    )
  }" and run ${underline("deno task dev")} to get started!
  `);
  Deno.exit(0);
}
await createUltraApp();
