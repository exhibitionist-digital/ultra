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
    h4: "h4",
    span: "span"
  }, _provideComponents(), props.components);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      id: "philosophy",
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
      id: "give-us-esm-or-give-us-death",
      children: _jsx(_components.a, {
        href: "#give-us-esm-or-give-us-death",
        children: "Give us ESM or give us death"
      })
    }), "\n", _jsx(_components.hr, {}), "\n", _jsx(_components.h3, {
      id: "breakdown-of-a-basic-ultra-project",
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
        className: "hljs language-sh",
        children: "deno run -A -r https://deno.land/x/ultra/init.ts\n"
      })
    }), "\n", _jsx(_components.h4, {
      id: "importmapjson",
      children: _jsx(_components.a, {
        href: "#importmapjson",
        children: "importMap.json"
      })
    }), "\n", _jsx(_components.pre, {
      children: _jsxs(_components.code, {
        className: "hljs language-json",
        children: [_jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n  ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"imports\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n    ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"react\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"https://esm.sh/react@18.2.0\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n    ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"react/\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"https://esm.sh/react@18.2.0/\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n    ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"react-dom\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"https://esm.sh/react-dom@18.2.0\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n    ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"react-dom/\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"https://esm.sh/react-dom@18.2.0/\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n    ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"ultra/\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"https://deno.land/x/ultra@v2.0.0-alpha.6/\""
        }), "\n  ", _jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n", _jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n"]
      })
    }), "\n", _jsxs(_components.p, {
      children: ["Atm, these are the only deps required to run an ", _jsx(_components.strong, {
        children: "Ultra"
      }), " project. Simple, I like it."]
    }), "\n", _jsx(_components.h4, {
      id: "servertsx",
      children: _jsx(_components.a, {
        href: "#servertsx",
        children: "server.tsx"
      })
    }), "\n", _jsx(_components.pre, {
      children: _jsxs(_components.code, {
        className: "hljs language-js",
        children: [_jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { serve } ", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"https://deno.land/std@0.153.0/http/server.ts\""
        }), ";\n", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { createServer } ", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"ultra/server.ts\""
        }), ";\n", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " ", _jsx(_components.span, {
          className: "hljs-title class_",
          children: "App"
        }), " ", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"./src/app.tsx\""
        }), ";\n\n", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " server = ", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "await"
        }), " ", _jsx(_components.span, {
          className: "hljs-title function_",
          children: "createServer"
        }), "({\n  ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "importMapPath"
        }), ": ", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), ".", _jsx(_components.span, {
          className: "hljs-property",
          children: "meta"
        }), ".", _jsx(_components.span, {
          className: "hljs-title function_",
          children: "resolve"
        }), "(", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"./importMap.json\""
        }), "),\n  ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "browserEntrypoint"
        }), ": ", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), ".", _jsx(_components.span, {
          className: "hljs-property",
          children: "meta"
        }), ".", _jsx(_components.span, {
          className: "hljs-title function_",
          children: "resolve"
        }), "(", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"./client.tsx\""
        }), "),\n});\n\nserver.", _jsx(_components.span, {
          className: "hljs-title function_",
          children: "get"
        }), "(", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"*\""
        }), ", ", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "async"
        }), " (context) => {\n  ", _jsx(_components.span, {
          className: "hljs-comment",
          children: "/**\n   * Render the request\n   */"
        }), "\n  ", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " result = ", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "await"
        }), " server.", _jsx(_components.span, {
          className: "hljs-title function_",
          children: "render"
        }), "(", _jsx(_components.span, {
          className: "xml",
          children: _jsxs(_components.span, {
            className: "hljs-tag",
            children: ["<", _jsx(_components.span, {
              className: "hljs-name",
              children: "App"
            }), " />"]
          })
        }), ");\n\n  ", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " context.", _jsx(_components.span, {
          className: "hljs-title function_",
          children: "body"
        }), "(result, ", _jsx(_components.span, {
          className: "hljs-number",
          children: "200"
        }), ", {\n    ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"content-type\""
        }), ": ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"text/html\""
        }), ",\n  });\n});\n\n", _jsx(_components.span, {
          className: "hljs-title function_",
          children: "serve"
        }), "(server.", _jsx(_components.span, {
          className: "hljs-property",
          children: "fetch"
        }), ");\n"]
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
      id: "clienttsx",
      children: _jsx(_components.a, {
        href: "#clienttsx",
        children: "client.tsx"
      })
    }), "\n", _jsx(_components.pre, {
      children: _jsxs(_components.code, {
        className: "hljs language-js",
        children: [_jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { hydrateRoot } ", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"react-dom/client\""
        }), ";\n", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " ", _jsx(_components.span, {
          className: "hljs-title class_",
          children: "App"
        }), " ", _jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"./src/app.tsx\""
        }), ";\n\n", _jsx(_components.span, {
          className: "hljs-title function_",
          children: "hydrateRoot"
        }), "(", _jsx(_components.span, {
          className: "hljs-variable language_",
          children: "document"
        }), ", ", _jsx(_components.span, {
          className: "xml",
          children: _jsxs(_components.span, {
            className: "hljs-tag",
            children: ["<", _jsx(_components.span, {
              className: "hljs-name",
              children: "App"
            }), " />"]
          })
        }), ");  \n"]
      })
    }), "\n", _jsx(_components.p, {
      children: "This should look familiar to most... This is your client entrypoint, and what is used for client rendering. It can be customised if needed."
    }), "\n", _jsx(_components.h4, {
      id: "src",
      children: _jsx(_components.a, {
        href: "#src",
        children: "src/"
      })
    }), "\n", _jsx(_components.p, {
      children: "Put your source code here."
    }), "\n", _jsx(_components.h4, {
      id: "public",
      children: _jsx(_components.a, {
        href: "#public",
        children: "public/"
      })
    }), "\n", _jsx(_components.p, {
      children: "Static files go here. When building for production, these files will be versioned."
    }), "\n", _jsx(_components.h4, {
      id: "denojson",
      children: _jsx(_components.a, {
        href: "#denojson",
        children: "deno.json"
      })
    }), "\n", _jsx(_components.pre, {
      children: _jsxs(_components.code, {
        className: "hljs language-json",
        children: [_jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n  ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"tasks\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n    ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"dev\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"deno run -A --no-check --watch ./server.tsx\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n    ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"build\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"deno run -A ./build.ts\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n    ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"start\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"ULTRA_MODE=production deno run -A --no-remote ./server.js\""
        }), "\n  ", _jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n  ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"compilerOptions\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n    ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"jsx\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"react-jsxdev\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n    ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"jsxImportSource\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"react\""
        }), "\n  ", _jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n  ", _jsx(_components.span, {
          className: "hljs-attr",
          children: "\"importMap\""
        }), _jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"./importMap.json\""
        }), "\n", _jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n"]
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
