import { Context, Middleware, Next } from "../types.ts";

export function dispatch<C extends Context = Context>(
  middlewares: Middleware<C>[],
  context: C,
  index = 0,
): Next {
  const nextMiddlewareFunction = middlewares[index];
  if (!nextMiddlewareFunction) {
    return async () => {};
  }
  return async (shortCircuit?: boolean) => {
    if (shortCircuit) {
      return;
    }

    await nextMiddlewareFunction(
      context,
      dispatch(middlewares, context, index + 1),
    );
  };
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

export async function handleMiddleware<C extends Context = Context>(
  middlewares: Middleware<C>[],
  context: C,
): Promise<void> {
  await compose(...middlewares)(context, async () => {});
}
