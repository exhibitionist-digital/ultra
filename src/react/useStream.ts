import { createContext, useContext } from "react";
import { isClientSide } from "./utils.ts";

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
