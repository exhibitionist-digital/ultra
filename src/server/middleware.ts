import { Context, Middleware, Next } from "../types.ts";

export function dispatch<C extends Context = Context>(
  middlewares: Middleware<C>[],
  context: C,
  index = 0,
): Next {
  const nextMiddlewareFunction = middlewares[index];
  return nextMiddlewareFunction
    ? async (shortCircuit?: boolean) => {
      if (shortCircuit) {
        return;
      }

      await nextMiddlewareFunction(
        context,
        dispatch(middlewares, context, index + 1),
      );
    }
    : async () => {};
}

export function compose<C extends Context = Context>(
  ...middlewares: Middleware<C>[]
): Middleware<C> {
  return async function composedMiddleware(
    context: C,
    next: Next,
  ) {
    await dispatch(middlewares, context)();
    await next();
  };
}
