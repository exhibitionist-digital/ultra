import { Context, Middleware, MiddlewareNextFunction } from "../types.ts";

export function createNextFunction(
  middleware: Middleware[],
  context: Context,
  index = 0,
): MiddlewareNextFunction {
  const nextMiddlewareFunction = middleware[index];
  if (!nextMiddlewareFunction) {
    return async () => {};
  }
  return async (shortCircuit?: boolean) => {
    if (shortCircuit) {
      return;
    }

    await nextMiddlewareFunction(
      context,
      createNextFunction(middleware, context, index + 1),
    );
  };
}

export async function handleMiddleware(
  middleware: Middleware[],
  context: Context,
): Promise<void> {
  if (middleware.length === 0) {
    return;
  }
  await createNextFunction(middleware, context)();
}
