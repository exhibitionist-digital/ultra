import { lazy, Suspense } from "react";
import Todo from "./todo.tsx";

const SlowTodo = lazy(() => import("./slow-todo.tsx"));

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>with-react-query</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <Todo id={1} />
        <Todo id={2} />
        <Todo id={3} />
        <Suspense fallback={<div>Loading</div>}>
          <SlowTodo id={4} />
        </Suspense>
      </body>
    </html>
  );
}
