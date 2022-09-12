import { renderToStaticMarkup } from "react-dom/server";
import useAsync from "../hooks/use-async.js";
import AsyncEffectContext from "../hooks/async-effect-context.js";
import { PropsWithChildren } from "react";

Deno.test("render", () => {
  const promise = new Promise((resolve) => resolve({ foo: "bar" }));

  const App = () => {
    const data = useAsync(promise);
    return <div>Hello World</div>;
  };

  const asyncEffects = new Set();

  const addAsyncEffect = (promise: any) => {
    asyncEffects.add(promise);
  };

  const Provider = ({ children }: PropsWithChildren) => {
    return (
      <AsyncEffectContext.Provider value={addAsyncEffect}>
        {children}
      </AsyncEffectContext.Provider>
    );
  };

  const result = renderToStaticMarkup(
    <Provider>
      <App />
    </Provider>,
  );

  console.log(asyncEffects);
});
