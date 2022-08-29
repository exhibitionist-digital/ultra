/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import {useMDXComponents as _provideComponents} from "@mdx-js/react";
function _createMdxContent(props) {
  const _components = Object.assign({
    h3: "h3",
    p: "p",
    img: "img",
    strong: "strong",
    a: "a",
    em: "em"
  }, _provideComponents(), props.components);
  return _jsxs(_Fragment, {
    children: [_jsxs(_components.h3, {
      children: ["The Quest for ", _jsx("span", {
        children: "Zero-Legacy"
      })]
    }), "\n", _jsxs("figure", {
      children: [_jsx(_components.p, {
        children: _jsx(_components.img, {
          src: "/paradise.webp",
          alt: "esm paradise, endless opportunity"
        })
      }), _jsxs(_components.p, {
        children: ["You awake... the year is ", _jsx("span", {
          children: "{{currentYear}}"
        }), "...", _jsx("br", {}), _jsx("br", {}), _jsx(_components.strong, {
          children: _jsx(_components.a, {
            href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
            children: "ECMAScript modules"
          })
        }), " have been standardised and supported in all relevant browsers...", _jsx("br", {}), _jsx("br", {}), "The potential for elegant code, powerful experiences, and browser-native superpowers knows no bounds..."]
      })]
    }), "\n", _jsxs("figure", {
      children: [_jsx(_components.p, {
        children: _jsx(_components.img, {
          src: "/orcs.webp",
          alt: "club-weilding bundling orcs"
        })
      }), _jsxs(_components.p, {
        children: ["Yet, roaming hordes of club-weilding orcs continue the ancient practice of ", _jsx("span", {
          children: "\"bundling\""
        }), "...", _jsx("br", {}), _jsx("br", {}), "A practice that dates back to the prehistoric times of ", _jsx(_components.strong, {
          children: "Internet Explora"
        }), ".", _jsx("br", {}), _jsx("br", {}), "Surely, this is some kind of sick joke? Do they not know about things like ", _jsx(_components.strong, {
          children: _jsx(_components.a, {
            href: "https://wicg.github.io/import-maps/",
            children: "import maps"
          })
        }), " and ", _jsx(_components.strong, {
          children: _jsx(_components.a, {
            href: "https://v8.dev/features/dynamic-import",
            children: "http imports"
          })
        }), "?"]
      })]
    }), "\n", _jsxs("figure", {
      children: [_jsx(_components.p, {
        children: _jsx(_components.img, {
          src: "/beast.webp",
          alt: "mythic beast of Bundle"
        })
      }), _jsxs(_components.p, {
        children: [_jsx(_components.em, {
          children: "(A wild bundling and transpilation beast appears)"
        }), _jsx("br", {}), _jsx("br", {}), _jsx("span", {
          children: "\"<CJS>>>:::require, req::... errr __i__mport e__sm not re_ady yet $$--expe$(rimental :::undefined::: bundle.cjs %%%type::type::type::<BUNDLE:bundle>\""
        }), _jsx("br", {}), _jsx("br", {}), _jsx(_components.em, {
          children: "What's it trying to say?"
        }), _jsx("br", {}), _jsx("br", {}), "You can't help but feel bad, it's been force-fed a hellish mix of non-web standards its entire life from people much smarter than us on Hacker News."]
      })]
    }), "\n", _jsxs("figure", {
      children: [_jsx(_components.p, {
        children: _jsx(_components.img, {
          src: "/archangel.webp",
          alt: "esm archangel"
        })
      }), _jsxs(_components.p, {
        children: [_jsx("span", {
          children: "Our mission:"
        }), _jsx("br", {}), "Rely on web standards, utilise web APIs, write apps that work identically in the browser and on the runtime.", _jsx("br", {}), _jsx("br", {}), "Do we bundle?", _jsx("br", {}), _jsx("span", {
          children: "No, we use import maps and ESM from top to bottom."
        }), _jsx("br", {}), _jsx("br", {}), "Do we ship js?", _jsx("br", {}), _jsx("span", {
          children: "Yes, we love it."
        }), " ", _jsx("span", {
          children: "Browser is life, and javascript is good."
        }), _jsx("br", {}), _jsx("br", {}), "Can I use jsx and TypeScript?", _jsx("br", {}), _jsx("span", {
          children: "If you want."
        })]
      })]
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
