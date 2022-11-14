import { Config } from "../common/config.ts";

export function wouterContent(config: Config) {
  return `
${config.ts ? 'import type { PropsWithChildren } from "react";' : ""}
import { createContext, useContext, useEffect, useState } from "react";

${
    config.ts
      ? `const SearchParamsContext = createContext<URLSearchParams>(
  new URLSearchParams(),
);`
      : `
const SearchParamsContext = createContext(
  new URLSearchParams(),
);`
  }

${
    config.ts
      ? `
type SearchParamsProviderProps = PropsWithChildren<{
  value: URLSearchParams;
}>;
`
      : ""
  }

export function SearchParamsProvider(
  { value, children }${config.ts ? ": SearchParamsProviderProps" : ""},
) {
  const [state, setState] = useState(value);

  useEffect(() => {
    function updateSearchParams() {
      setState(new URLSearchParams(location.search));
    }

    addEventListener("popstate", updateSearchParams);
    addEventListener("pushState", updateSearchParams);
    addEventListener("replaceState", updateSearchParams);
    return function cleanup() {
      removeEventListener("popstate", updateSearchParams);
      removeEventListener("pushState", updateSearchParams);
      removeEventListener("replaceState", updateSearchParams);
    };
  }, []);

  return (
    <SearchParamsContext.Provider value={state}>
      {children}
    </SearchParamsContext.Provider>
  );
}

export function useSearchParams() {
  return useContext(SearchParamsContext);
}
   `;
}
