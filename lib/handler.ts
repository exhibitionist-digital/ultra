export interface RequestHandler {
  handleRequest: (request: Request) => Promise<Response>;
  supportsRequest: (request: Request) => boolean;
}

export function executeHandler (request: Request, handler: RequestHandler) {
  try {
    if (handler.supportsRequest(request)) {
      return handler.handleRequest(request);
    }
  } catch (_) {
    return null;
  }
}

export function composeHandlers (...handlers: RequestHandler[]) {
  return function executeHandlerArray (request: Request) {
    for (const handler of handlers) {
      const response = executeHandler(request, handler);
      if (response) return response;
    }
    return null;
  }
}
