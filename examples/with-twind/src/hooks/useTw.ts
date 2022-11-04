import { type Token } from "twind";
import { useTwContext } from "../context/twind.tsx";

export function useTw() {
  const context = useTwContext();
  return function tw(tokens?: Token | Token[]) {
    return context(tokens);
  };
}
