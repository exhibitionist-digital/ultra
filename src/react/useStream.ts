import { createContext, useContext } from "react";
import { isClientSide } from "./utils.ts";

/**
 * All of this has been taken from {@link https://github.com/brillout/react-streaming}
 * and modified to work within Deno
 *
 * If we can get a Deno native module {@link https://github.com/brillout/react-streaming/issues/3}
 * we should be able to just use it as a dependency
 */

type StreamUtils = {
  injectToStream: (htmlChunk: string) => void;
};

const StreamContext = createContext<StreamUtils | null>(null);
export const StreamProvider = StreamContext.Provider;

export function useStream() {
  if (isClientSide()) {
    return null;
  }
  const streamUtils = useContext(StreamContext);
  return streamUtils;
}
