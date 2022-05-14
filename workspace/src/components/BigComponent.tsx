import { ReactNode } from "react";
import { useAsync } from "@ultra/react";

export default function BigComponent({ children }: { children?: ReactNode }) {
  const data = useAsync(() => {
    return Promise.resolve("test");
  });
  return (
    <h3>
      This is a lazily loaded component
      {data}
      {children}
    </h3>
  );
}
