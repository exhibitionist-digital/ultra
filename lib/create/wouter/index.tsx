import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";

const SearchParamsContext = createContext<URLSearchParams>(
  new URLSearchParams(),
);

type SearchParamsProviderProps = PropsWithChildren<{
  value: URLSearchParams;
}>;

export function SearchParamsProvider(
  { value, children }: SearchParamsProviderProps,
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
