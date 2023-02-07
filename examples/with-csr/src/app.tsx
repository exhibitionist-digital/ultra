import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <h1>
        <span></span>__<span></span>
      </h1>
      <p>
        Welcome to{" "}
        <strong>Ultra</strong>. This is a barebones starter for your web app.
      </p>
      <button onClick={() => setCount(count + 1)}>the count is {count}</button>
      <p>
        Take{" "}
        <a href="https://ultrajs.dev/docs" target="_blank">
          this
        </a>
        , you may need it where you are going. It will show you how to customise
        your routing, data fetching, and styling with popular libraries.
      </p>
    </main>
  );
}
