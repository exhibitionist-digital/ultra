import { RenderFunction } from "../renderer.ts";
import { createCompilerHandler } from "./compiler.ts";
import { createRenderHandler } from "./renderer.ts";

type CreateReactHandlerOptions = {
  root: string | URL;
  render: RenderFunction<ReadableStream>;
};

export function createReactHandler(options: CreateReactHandlerOptions) {
  const renderer = createRenderHandler({
    root: options.root,
    render: options.render,
  });

  const compiler = createCompilerHandler({
    root: options.root,
  });

  const handleRequest = (request: Request) => {
    if (compiler.supportsRequest(request)) {
      return compiler.handleRequest(request);
    }

    if (renderer.supportsRequest(request)) {
      return renderer.handleRequest(request);
    }

    return new Response("Not Found", { status: 404 });
  };

  const supportsRequest = (request: Request) => {
    return compiler.supportsRequest(request) ||
      renderer.supportsRequest(request);
  };

  return {
    handleRequest,
    supportsRequest,
  };
}
