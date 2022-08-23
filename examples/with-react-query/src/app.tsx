import { Suspense } from "react";
import Todo from "./todo.tsx";

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
        <Todo key={`todo-1`} id={1} />
        <Todo key={`todo-2`} id={2} />
        <Todo key={`todo-3`} id={3} />
        <Suspense fallback={<div>Loading</div>}>
          <Todo id={4} />
        </Suspense>
      </body>
    </html>
  );
}
