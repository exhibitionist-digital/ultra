// @ts-nocheck add types
import { useSsrData } from "./useSsrData.ts";
import { isServerSide } from "./utils.ts";

export const ultraFetch = (pathname: string, options = { method: "GET" }) => {
  return useSsrData(pathname, () => {
    if (isServerSide()) {
      const handler = self.__ultraRouter.find(options.method, {
        url: { pathname },
      });
      return handler(new Request(pathname, options)).then((response) =>
        response.json()
      );
    }
    return fetch(pathname, options).then((response) => response.json());
  });
};
