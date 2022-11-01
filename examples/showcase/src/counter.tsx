import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <figure>
        <h2>{count}</h2>
        <button onClick={() => setCount(count + 1)}>ADD COUNT</button>
      </figure>
      <p>Apologies for doing this, but here is a basic counter...</p>
      <p>
        If you check the network tab again, you can see your project code is
        being shipped natively as ESM. Nothing more, nothing less. What is cool
        is that you can use dynamic imports to act as a way to natively
        code-split your source code..
      </p>
      <p>
        Don't believe us, it's in the React documentation!{" "}
        <a
          href="https://reactjs.org/docs/code-splitting.html#reactlazy"
          target="_blank"
        >
          https://reactjs.org/docs/code-splitting.html#reactlazy
        </a>
      </p>
      <hr />
      <p>
        <a href="tw">Hey, Do you like Tailwind?</a>
      </p>
    </>
  );
};

export default Counter;
