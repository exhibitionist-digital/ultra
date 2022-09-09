import {
  brightBlue,
  green,
  underline,
  white,
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

async function execute(context: TaskContext, utils: TaskUtils) {
  const tasks = taskQueue([
    createFileTask("deno.json", denoConfigContent(utils)),
    createFileTask("importMap.json", importMapContent()),
    createFileTask(
      utils.dialectFilename("build"),
      buildContent(utils),
    ),
    createFileTask(
      utils.dialectFilename("server", true),
      serverContent(utils),
    ),
    createFileTask(
      utils.dialectFilename("client", true),
      clientContent(utils),
    ),
    createFileTask(
      utils.dialectFilename("src/app", true),
      helloUltraContent(),
    ),
    fetchFileTask(
      "public/favicon.ico",
      import.meta.resolve("./examples/basic/public/favicon.ico"),
    ),
    fetchFileTask(
      "public/robots.txt",
      import.meta.resolve("./examples/basic/public/robots.txt"),
    ),
    createFileTask(
      "public/style.css",
      styleContent(),
    ),
  ]);

  for (const task of tasks) {
    await task(context);
  }
}

function createFileTask(path: string, content: string | Uint8Array) {
  return async (context: TaskContext) => {
    let overwritten = false;
    path = join(context.cwd, context.output, path);

    if (!context.overwrite && await exists(path)) {
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

    const createFile = createFileTask(
      path,
      new Uint8Array(content),
    );

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

async function ask(question = ":", stdin = Deno.stdin, stdout = Deno.stdout) {
  await stdout.write(new TextEncoder().encode(question + " "));
  const buf = new Uint8Array(1024);
  const n = <number> await stdin.read(buf);
  const answer = new TextDecoder().decode(buf.subarray(0, n));
  return answer.trim();
}

async function confirm(question = "Are you sure?") {
  let a: string;
  while (
    !/^(y|n)$/i.test(a = (await ask(question + white(" [y/n]"))).trim())
    // deno-lint-ignore no-empty
  ) {
  }
  return a.toLowerCase() === "y";
}

function resolveDialect(typescript: boolean) {
  return typescript ? "ts" : "js";
}

function denoConfigContent(utils: TaskUtils) {
  const serverEntrypoint = utils.dialectFilename("./server", true);
  const buildEntrypoint = utils.dialectFilename("./build", false);

  // deno-fmt-ignore
  return outdent`
    {
      "tasks": {
        "dev": "deno run -A --no-check --watch ${serverEntrypoint}",
        "build": "deno run -A ${buildEntrypoint}",
        "start": "ULTRA_MODE=production deno run -A --no-remote ./server.js"
      },
      "compilerOptions": {
        "jsx": "react-jsxdev",
        "jsxImportSource": "react"
      },
      "importMap": "./importMap.json"
    }
  `;
}

function importMapContent() {
  return outdent`
    {
      "imports": {
        "react": "https://esm.sh/react@18.2.0?dev",
        "react/": "https://esm.sh/react@18.2.0/",
        "react-dom": "https://esm.sh/react-dom@18.2.0",
        "react-dom/server": "https://esm.sh/react-dom@18.2.0/server?dev",
        "react-dom/client": "https://esm.sh/react-dom@18.2.0/client?dev",
        "ultra/": "${import.meta.url.replace("create.ts", "")}"
      }
    }
  `;
}

function buildContent(utils: TaskUtils) {
  const browserEntrypoint = utils.dialectFilename("./client", true);
  const serverEntrypoint = utils.dialectFilename("./server", true);

  // deno-fmt-ignore
  return outdent`
    import { createBuilder } from "ultra/build.ts";

    const builder = createBuilder({
      browserEntrypoint: import.meta.resolve("${browserEntrypoint}"),
      serverEntrypoint: import.meta.resolve("${serverEntrypoint}"),
    });
    
    // deno-lint-ignore no-unused-vars
    const result = await builder.build();
  `;
}

function serverContent(utils: TaskUtils) {
  const browserEntrypoint = utils.dialectFilename("client", true);
  const app = utils.dialectFilename("app", true);

  // deno-fmt-ignore
  return outdent`
    import { serve } from "https://deno.land/std@0.153.0/http/server.ts";
    import { createServer } from "ultra/server.ts";
    import App from "./src/${app}";
    
    const server = await createServer({
      importMapPath: import.meta.resolve("./importMap.json"),
      browserEntrypoint: import.meta.resolve("./${browserEntrypoint}"),
    });
    
    server.get("*", async (context) => {
      /**
       * Render the request
       */
      const result = await server.render(<App />);
    
      return context.body(result, 200, {
        "content-type": "text/html",
      });
    });
    
    serve(server.fetch);
  `;
}

function clientContent(utils: TaskUtils) {
  const app = utils.dialectFilename("app", true);
  // deno-fmt-ignore
  return outdent`
    import { hydrateRoot } from "react-dom/client";
    import App from "./src/${app}";
    
    hydrateRoot(document, <App />);  
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
  `;
}

function helloUltraContent() {
  // deno-fmt-ignore
  return outdent`
    import useAsset from "ultra/hooks/use-asset.js";

    export default function App() {
      console.log("Hello world!");
      return (
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <title>Ultra</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="shortcut icon" href={useAsset("./favicon.ico")} />
            <link rel="preload" as="style" href={useAsset("./style.css")} />
            <link rel="stylesheet" href={useAsset("./style.css")} />
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
              <p>
                Take{" "}
                <a
                  href="https://ultrajs.dev/docs"
                  target="_blank"
                >
                  this
                </a>, you may need it where you are going. It will show you how to
                customise your routing, data fetching, and styling with popular
                libraries.
              </p>
            </main>
          </body>
        </html>
      );
    }
  `;
}

function dialectExtension(dialect: Dialect, isJsx?: boolean) {
  switch (dialect) {
    case "js":
      return isJsx ? "jsx" : "js";
    case "ts":
      return isJsx ? "tsx" : "ts";
  }
}

if (import.meta.main) {
  // deno-fmt-ignore
  console.log(outdent`${brightBlue(`
    ▄• ▄▌▄▄▌  ▄▄▄▄▄▄▄▄   ▄▄▄· 
    █▪██▌██•  •██  ▀▄ █·▐█ ▀█ 
    █▌▐█▌██▪   ▐█.▪▐▀▀▄ ▄█▀▀█ 
    ▐█▄█▌▐█▌▐▌ ▐█▌·▐█•█▌▐█ ▪▐▌
     ▀▀▀ .▀▀▀  ▀▀▀ .▀  ▀ ▀  ▀`)} \n
    Let's get you setup with your new Ultra project.\n
    But first, we need to ask just a few questions.\n
  `);

  let output = "";

  while (output === "") {
    output = await ask(
      brightBlue("Where do you want to initialise your new project?"),
    );
  }

  const typescript = await confirm(
    brightBlue("Do you want to use TypeScript?"),
  );
  const dialect: Dialect = resolveDialect(typescript);

  const context: TaskContext = {
    cwd: Deno.cwd(),
    output: output,
    overwrite: false,
    dialect,
  };

  const utils: TaskUtils = {
    dialectFilename(filename: string, isJsx?: boolean) {
      const extension = dialectExtension(dialect, isJsx);
      return `${filename}.${extension}`;
    },
  };

  const confirmed = await confirm(
    brightBlue("Ready to go?"),
  );

  if (confirmed) {
    console.log("\n");
    await execute(context, utils);

    // deno-fmt-ignore
    console.log(outdent`
      \n 🧙‍♂️ BONZA! Your new Ultra project is ready, you can now cd into "${brightBlue(output)}" and run ${underline("deno task dev")} to get started!
    `);
  } else {
    Deno.exit(0);
  }
}
