import { ReactNode } from "react";
import { useAsync } from "@ultra/react";

export default function BigComponent({ children }: { children?: ReactNode }) {
  const data = useAsync("post", () => {
    return fetch("https://jsonplaceholder.typicode.com/posts/1").then(
      (response) => response.json(),
    );
  });

  return (
    <h3>
      This is a lazily loaded component
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {children}
    </h3>
  );
}
