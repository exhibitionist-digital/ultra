/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import {useMDXComponents as _provideComponents} from "@mdx-js/react";
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: "h1",
    p: "p",
    strong: "strong",
    ul: "ul",
    li: "li",
    hr: "hr",
    h2: "h2",
    a: "a",
    h3: "h3",
    pre: "pre",
    code: "code",
    h4: "h4"
  }, _provideComponents(), props.components);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: "philosophy"
    }), "\n", _jsxs(_components.p, {
      children: [_jsx(_components.strong, {
        children: "Ultra"
      }), " takes a non-prescriptive approach to web-app development. You can configure it to use most existing libraries that you are accustomed to — or you can write your own..."]
    }), "\n", _jsxs(_components.p, {
      children: ["We want ", _jsx(_components.strong, {
        children: "Ultra"
      }), " to do a few things, and do them well."]
    }), "\n", _jsxs(_components.ul, {
      children: ["\n", _jsx(_components.li, {
        children: "React Streaming SSR, with Suspense support"
      }), "\n", _jsx(_components.li, {
        children: "Native import maps from top to bottom"
      }), "\n", _jsx(_components.li, {
        children: "Import maps with vendored dependencies in production"
      }), "\n", _jsx(_components.li, {
        children: "Shipping pure, unbundled ESM always"
      }), "\n", _jsx(_components.li, {
        children: "Simplifying your tool chain, removing the 'black-box bundler' approach"
      }), "\n", _jsx(_components.li, {
        children: "Write apps that work the same way in the browser that they do on the server"
      }), "\n", _jsx(_components.li, {
        children: "Utilise service workers to cache your ESM source code"
      }), "\n"]
    }), "\n", _jsx(_components.hr, {}), "\n", _jsx(_components.h2, {
      children: _jsx(_components.a, {
        href: "#give-us-esm-or-give-us-death",
        children: "Give us ESM or give us death"
      })
    }), "\n", _jsx(_components.hr, {}), "\n", _jsx(_components.h3, {
      children: _jsxs(_components.a, {
        href: "#breakdown-of-a-basic-ultra-project",
        children: ["Breakdown of a basic ", _jsx(_components.strong, {
          children: "Ultra"
        }), " project"]
      })
    }), "\n", _jsxs(_components.p, {
      children: ["To follow along at home, run this command to quickly scaffold out a basic ", _jsx(_components.strong, {
        children: "Ultra"
      }), " project."]
    }), "\n", _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-sh",
        children: "deno run -A -r https://deno.land/x/ultra/init.ts\n"
      })
    }), "\n", _jsx(_components.h4, {
      children: _jsx(_components.a, {
        href: "#importmapjson",
        children: "importMap.json"
      })
    }), "\n", _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-json",
        children: "{\n  \"imports\": {\n    \"react\": \"https://esm.sh/react@18.2.0\",\n    \"react/\": \"https://esm.sh/react@18.2.0/\",\n    \"react-dom\": \"https://esm.sh/react-dom@18.2.0\",\n    \"react-dom/\": \"https://esm.sh/react-dom@18.2.0/\",\n    \"ultra/\": \"https://deno.land/x/ultra@v2.0.0-alpha.6/\"\n  }\n}\n"
      })
    }), "\n", _jsxs(_components.p, {
      children: ["Atm, these are the only deps required to run an ", _jsx(_components.strong, {
        children: "Ultra"
      }), " project. Simple, I like it."]
    }), "\n", _jsx(_components.h4, {
      children: _jsx(_components.a, {
        href: "#servertsx",
        children: "server.tsx"
      })
    }), "\n", _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-js",
        children: "import { serve } from \"https://deno.land/std@0.153.0/http/server.ts\";\nimport { createServer } from \"ultra/server.ts\";\nimport App from \"./src/app.tsx\";\n\nconst server = await createServer({\n  importMapPath: import.meta.resolve(\"./importMap.json\"),\n  browserEntrypoint: import.meta.resolve(\"./client.tsx\"),\n});\n\nserver.get(\"*\", async (context) => {\n  /**\n   * Render the request\n   */\n  const result = await server.render(<App />);\n\n  return context.body(result, 200, {\n    \"content-type\": \"text/html\",\n  });\n});\n\nserve(server.fetch);\n"
      })
    }), "\n", _jsx(_components.p, {
      children: "This file controls how your app will render on the server. It's using Deno's std http server, you can probably use another one if you want."
    }), "\n", _jsxs(_components.p, {
      children: [_jsx(_components.code, {
        children: "createServer"
      }), " kickstarts the ", _jsx(_components.strong, {
        children: "Ultra"
      }), " renderer and static asset pipeline, it only needs your import map and client entry point."]
    }), "\n", _jsxs(_components.p, {
      children: ["You can also look at creating API routes here by following ", _jsx(_components.a, {
        href: "https://github.com/exhibitionist-digital/ultra/tree/main/examples/with-api-routes",
        children: "this example"
      }), "."]
    }), "\n", _jsx(_components.h4, {
      children: _jsx(_components.a, {
        href: "#clienttsx",
        children: "client.tsx"
      })
    }), "\n", _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-js",
        children: "import { hydrateRoot } from \"react-dom/client\";\nimport App from \"./src/app.tsx\";\n\nhydrateRoot(document, <App />);  \n"
      })
    }), "\n", _jsx(_components.p, {
      children: "This should look familiar to most... This is your client entrypoint, and what is used for client rendering. It can be customised if needed."
    }), "\n", _jsx(_components.h4, {
      children: _jsx(_components.a, {
        href: "#src",
        children: "src/"
      })
    }), "\n", _jsx(_components.p, {
      children: "Put your source code here."
    }), "\n", _jsx(_components.h4, {
      children: _jsx(_components.a, {
        href: "#public",
        children: "public/"
      })
    }), "\n", _jsx(_components.p, {
      children: "Static files go here. When building for production, these files will be versioned."
    }), "\n", _jsx(_components.h4, {
      children: _jsx(_components.a, {
        href: "#denojson",
        children: "deno.json"
      })
    }), "\n", _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-json",
        children: "{\n  \"tasks\": {\n    \"dev\": \"deno run -A --no-check --watch ./server.tsx\",\n    \"build\": \"deno run -A ./build.ts\",\n    \"start\": \"ULTRA_MODE=production deno run -A --no-remote ./server.js\"\n  },\n  \"compilerOptions\": {\n    \"jsx\": \"react-jsxdev\",\n    \"jsxImportSource\": \"react\"\n  },\n  \"importMap\": \"./importMap.json\"\n}\n"
      })
    }), "\n", _jsx(_components.p, {
      children: "We use Deno's native task runner/config file."
    }), "\n", _jsxs(_components.p, {
      children: ["Try running ", _jsx(_components.code, {
        children: "deno task dev"
      }), ": This will spin up a development server and watch for file changes."]
    }), "\n", _jsxs(_components.p, {
      children: ["We use the ", _jsx(_components.code, {
        children: "react-jsx"
      }), " and ", _jsx(_components.code, {
        children: "react"
      }), " compiler options so you don't need to ", _jsx(_components.code, {
        children: "import React from 'react'"
      }), " everywhere."]
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = Object.assign({}, _provideComponents(), props.components);
  return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
    children: _jsx(_createMdxContent, props)
  })) : _createMdxContent(props);
}
export default MDXContent;
