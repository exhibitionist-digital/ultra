/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import {useMDXComponents as _provideComponents} from "@mdx-js/react";
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: "h1",
    blockquote: "blockquote",
    p: "p",
    strong: "strong",
    pre: "pre",
    code: "code",
    hr: "hr",
    h3: "h3",
    a: "a",
    h4: "h4",
    ul: "ul",
    li: "li",
    em: "em",
    span: "span"
  }, _provideComponents(), props.components);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      id: "docs",
      children: "docs"
    }), "\n", _jsxs(_components.blockquote, {
      children: ["\n", _jsx(_components.p, {
        children: "📝 These docs are a WIP of the alpha 2 release."
      }), "\n"]
    }), "\n", _jsxs(_components.p, {
      children: ["Welp, if you've made it here, you probably have a basic ", _jsx(_components.strong, {
        children: "Ultra"
      }), " project\nrunning. If not try this..."]
    }), "\n", _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "hljs language-bash",
        children: "deno run -A -r https://deno.land/x/ultra/init.ts\n"
      })
    }), "\n", _jsx(_components.hr, {}), "\n", _jsx(_components.h3, {
      id: "extending-ultra",
      children: _jsx(_components.a, {
        href: "#extending-ultra",
        children: "Extending Ultra"
      })
    }), "\n", _jsxs(_components.p, {
      children: [_jsx(_components.strong, {
        children: "Ultra"
      }), " gives you the control to use (or not use) many of the most popular\nReact libraries out there. You will probably\nneed to update your ", _jsx(_components.code, {
        children: "importMap.json"
      }), " ", _jsx(_components.code, {
        children: "server.tsx"
      }), " and ", _jsx(_components.code, {
        children: "client.tsx"
      })]
    }), "\n", _jsx(_components.p, {
      children: "We've prepared the following examples for you:"
    }), "\n", _jsx(_components.h4, {
      id: "routing",
      children: _jsx(_components.a, {
        href: "#routing",
        children: "Routing"
      })
    }), "\n", _jsxs(_components.ul, {
      children: ["\n", _jsxs(_components.li, {
        children: ["Wouter ", _jsx(_components.a, {
          href: "https://github.com/exhibitionist-digital/ultra/tree/main/examples/with-wouter",
          children: "(with-wouter)"
        })]
      }), "\n", _jsxs(_components.li, {
        children: ["React Router ", _jsx(_components.a, {
          href: "https://github.com/exhibitionist-digital/ultra/tree/main/examples/with-react-router",
          children: "(with-react-router)"
        })]
      }), "\n"]
    }), "\n", _jsx(_components.h4, {
      id: "data-fetching",
      children: _jsx(_components.a, {
        href: "#data-fetching",
        children: "Data Fetching"
      })
    }), "\n", _jsxs(_components.ul, {
      children: ["\n", _jsxs(_components.li, {
        children: ["React Query ", _jsx(_components.a, {
          href: "https://github.com/exhibitionist-digital/ultra/tree/main/examples/with-react-query",
          children: "(with-react-query)"
        })]
      }), "\n"]
    }), "\n", _jsx(_components.h4, {
      id: "css",
      children: _jsx(_components.a, {
        href: "#css",
        children: "CSS"
      })
    }), "\n", _jsxs(_components.ul, {
      children: ["\n", _jsxs(_components.li, {
        children: ["Emotion ", _jsx(_components.a, {
          href: "https://github.com/exhibitionist-digital/ultra/tree/main/examples/with-emotion",
          children: "(with-emotion)"
        })]
      }), "\n", _jsxs(_components.li, {
        children: ["Stitches ", _jsx(_components.a, {
          href: "https://github.com/exhibitionist-digital/ultra/tree/main/examples/with-stitches",
          children: "(with-stitches)"
        })]
      }), "\n", _jsxs(_components.li, {
        children: ["Twind ", _jsx(_components.a, {
          href: "https://github.com/exhibitionist-digital/ultra/tree/main/examples/with-twind",
          children: "(with-twind)"
        })]
      }), "\n"]
    }), "\n", _jsxs("small", {
      children: ["or just use plain old CSS, it's ", _jsx(_components.em, {
        children: "way"
      }), " underrated."]
    }), "\n", _jsx(_components.h4, {
      id: "head",
      children: _jsx(_components.a, {
        href: "#head",
        children: "Head"
      })
    }), "\n", _jsxs(_components.ul, {
      children: ["\n", _jsxs(_components.li, {
        children: ["React Helmet Async ", _jsx(_components.a, {
          href: "https://github.com/exhibitionist-digital/ultra/tree/main/examples/with-react-helmet-async",
          children: "(with-react-helmet-async)"
        })]
      }), "\n"]
    }), "\n", _jsx(_components.h4, {
      id: "api-routes",
      children: _jsx(_components.a, {
        href: "#api-routes",
        children: "API Routes"
      })
    }), "\n", _jsxs(_components.ul, {
      children: ["\n", _jsxs(_components.li, {
        children: ["Hono ", _jsx(_components.a, {
          href: "https://github.com/exhibitionist-digital/ultra/tree/main/examples/with-api-routes",
          children: "(with-api-routes)"
        })]
      }), "\n"]
    }), "\n", _jsx("small", {
      children: _jsx(_components.p, {
        children: "If there is an existing library that you want to use, there is a good chance\nyou can create a custom integration. Use some of the examples above as a guide\n-- open a PR if you are keen."
      })
    }), "\n", _jsx(_components.hr, {}), "\n", _jsx(_components.h3, {
      id: "ultra-hooks",
      children: _jsx(_components.a, {
        href: "#ultra-hooks",
        children: "Ultra Hooks"
      })
    }), "\n", _jsxs(_components.blockquote, {
      children: ["\n", _jsx(_components.p, {
        children: "🚧 This part of the documentation is still under construction"
      }), "\n"]
    }), "\n", _jsx(_components.hr, {}), "\n", _jsx(_components.h3, {
      id: "building-for-production",
      children: _jsx(_components.a, {
        href: "#building-for-production",
        children: "Building for production"
      })
    }), "\n", _jsx(_components.p, {
      children: "Ultra comes with a build function. What it do:"
    }), "\n", _jsxs(_components.ul, {
      children: ["\n", _jsxs(_components.li, {
        children: ["Creating a ", _jsx(_components.code, {
          children: ".ultra"
        }), " directory: ✅ Done"]
      }), "\n", _jsx(_components.li, {
        children: "Transpiling your source code to React.createElement: ✅ Done"
      }), "\n", _jsx(_components.li, {
        children: "Vendoring your projects dependencies: ✅ Done"
      }), "\n", _jsx(_components.li, {
        children: "Auto creating 2 production import maps (browser/runtime) using vendored deps: ✅ Done"
      }), "\n", _jsxs(_components.li, {
        children: ["Versioning your ", _jsx(_components.code, {
          children: "public/"
        }), " dir: ✅ Done"]
      }), "\n", _jsxs(_components.li, {
        children: ["Allowing your project to be run with ", _jsx(_components.code, {
          children: "--no-remote"
        }), ": ✅ Done"]
      }), "\n", _jsx(_components.li, {
        children: "A build pipeline which allows easy output configuration: ✅ Done"
      }), "\n", _jsx(_components.li, {
        children: "Support for various edge deployment platforms: ❌ WIP"
      }), "\n"]
    }), "\n", _jsx(_components.h4, {
      id: "import-maps",
      children: _jsx(_components.a, {
        href: "#import-maps",
        children: "Import maps"
      })
    }), "\n", _jsxs(_components.p, {
      children: [_jsx(_components.strong, {
        children: "Ultra"
      }), " will automatically create 2 import maps, with vendored dependencies. One for ", _jsx(_components.code, {
        children: "client.tsx"
      }), " and one for ", _jsx(_components.code, {
        children: "server.tsx"
      })]
    }), "\n", _jsx("small", {
      children: "This will be used as your browser's native import map."
    }), "\n", _jsxs("details", {
      children: [_jsx("summary", {
        children: _jsx(_components.strong, {
          children: "importMap.browser.json"
        })
      }), _jsx(_components.pre, {
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
            children: "\"react-dom/client\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/browser/esm.sh/react-dom@18.2.0/client.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"react/jsx-runtime\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/browser/esm.sh/react@18.2.0/jsx-runtime.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"https://esm.sh/\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/browser/esm.sh/\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"/_ultra/static/client.tsx\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"/_ultra/static/client.e3ed2639.tsx\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"/_ultra/static/src/app.tsx\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"/_ultra/static/src/app.29ddbcc7.tsx\""
          }), "\n  ", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "}"
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n  ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"scopes\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "{"
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"./vendor/browser/esm.sh/\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "{"
          }), "\n      ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"/stable/react@18.2.0/deno/react.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/browser/esm.sh/stable/react@18.2.0/deno/react.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n      ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"/stable/react@18.2.0/deno/react.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/browser/esm.sh/stable/react@18.2.0/deno/react.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n      ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"react\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/browser/esm.sh/react@18.2.0.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n      ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"/v92/react-dom@18.2.0/deno/react-dom.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/browser/esm.sh/v92/react-dom@18.2.0/deno/react-dom.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n      ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"/v92/scheduler@0.23.0/deno/scheduler.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/browser/esm.sh/v92/scheduler@0.23.0/deno/scheduler.js\""
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "}"
          }), "\n  ", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "}"
          }), "\n", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "}"
          }), "\n"]
        })
      })]
    }), "\n", _jsx("small", {
      children: "This will be used as your server's import map."
    }), "\n", _jsxs("details", {
      children: [_jsx("summary", {
        children: _jsx(_components.strong, {
          children: "importMap.server.json"
        })
      }), _jsx(_components.pre, {
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
            children: "\"react/jsx-runtime\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/server/esm.sh/react@18.2.0/jsx-runtime.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"ultra/server.ts\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/server/deno.land/x/ultra@v2.0.0-alpha.6/server.ts\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"https://deno.land/\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/server/deno.land/\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"https://esm.sh/\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/server/esm.sh/\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"./client.tsx\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./client.e3ed2639.tsx\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"./src/app.tsx\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./src/app.29ddbcc7.tsx\""
          }), "\n  ", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "}"
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n  ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"scopes\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "{"
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"./vendor/server/deno.land/\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "{"
          }), "\n      ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"react\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/server/esm.sh/react@18.2.0.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n      ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"react-dom/server\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/server/esm.sh/react-dom@18.2.0/server.js\""
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "}"
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"./vendor/server/esm.sh/\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "{"
          }), "\n      ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"/stable/react@18.2.0/deno/react.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/server/esm.sh/stable/react@18.2.0/deno/react.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ","
          }), "\n      ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "\"/stable/react@18.2.0/deno/react.js\""
          }), _jsx(_components.span, {
            className: "hljs-punctuation",
            children: ":"
          }), " ", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"./vendor/server/esm.sh/stable/react@18.2.0/deno/react.js\""
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "}"
          }), "\n  ", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "}"
          }), "\n", _jsx(_components.span, {
            className: "hljs-punctuation",
            children: "}"
          }), "\n"]
        })
      })]
    }), "\n", _jsx(_components.hr, {}), "\n", _jsx(_components.h3, {
      id: "deploying",
      children: _jsx(_components.a, {
        href: "#deploying",
        children: "Deploying"
      })
    }), "\n", _jsxs(_components.p, {
      children: ["Use this ", _jsx(_components.code, {
        children: "Dockerfile"
      }), ". It is multi-stage, and will both build and run the production ready app."]
    }), "\n", _jsx(_components.pre, {
      children: _jsxs(_components.code, {
        className: "hljs language-bash",
        children: ["FROM denoland/deno:1.25.0 as builder\nWORKDIR /app\nCOPY . /app\nRUN deno task build\n\nFROM denoland/deno:1.25.0\nEXPOSE 8000\nCOPY --from=builder /app/.ultra /app\nWORKDIR /app\nCMD [", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"deno\""
        }), ", ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"task\""
        }), ", ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"start\""
        }), "]\n"]
      })
    }), "\n", _jsx(_components.p, {
      children: "You can modify this as needed, another possible Dockerfile assumes you commit your build artifacts, or deploy locally from built files."
    }), "\n", _jsx(_components.pre, {
      children: _jsxs(_components.code, {
        className: "hljs language-bash",
        children: ["FROM denoland/deno:1.25.0\nEXPOSE 8000\nWORKDIR /app\nCOPY .ultra /app\nCMD [", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"deno\""
        }), ", ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"task\""
        }), ", ", _jsx(_components.span, {
          className: "hljs-string",
          children: "\"start\""
        }), "]\n"]
      })
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
