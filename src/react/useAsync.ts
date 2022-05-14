import { useId } from "react";
import { useSsrData } from "./useSsrData.ts";

export function useAsync<T>(asyncFn: () => Promise<T>): T {
  const id: string = useId();
  // TODO: throw new Error('Only one `useAsync()` hook can be used per component')
  return useSsrData(id, asyncFn);
}
