import {
  RenderStrategy,
  RequestContext,
  RequestContextFunction,
} from "../types.ts";

const defaultLocale = "en";
const defaultRenderStrategy: RenderStrategy = "stream";

export const defaultCreateRequestContext: RequestContextFunction<
  RequestContext
> = (
  request,
) => {
  return {
    url: new URL(request.url),
    state: new Map(),
    helmetContext: {
      helmet: {},
    },
    locale: defaultLocale,
    renderStrategy: defaultRenderStrategy,
  };
};

export const createRequestContextFactory = (
  createRequestContext?: RequestContextFunction,
) =>
  async (request: Request) => {
    if (!createRequestContext) {
      return defaultCreateRequestContext(request);
    }

    const defaultRequestContext = await defaultCreateRequestContext(request);
    const requestContext = await createRequestContext(request);

    return Object.assign(defaultRequestContext, requestContext);
  };
