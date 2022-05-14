import { Node } from "./deps.ts";
import { Context } from "./context.ts";
import type { RequestHandler } from "./types.ts";
import { removeTrailingSlash } from "./utils.ts";

/**
 * Based on the work of abc {@link https://github.com/zhmushan/abc/blob/master/router.ts}
 */
export class Router {
  trees: Record<string, Node<RequestHandler>> = {};

  add(
    method: string,
    path: string,
    handler: RequestHandler,
  ): void {
    if (path[0] !== "/") {
      path = `/${path}`;
    }

    path = removeTrailingSlash(path);

    let root = this.trees[method];

    if (!root) {
      root = new Node<RequestHandler>();
      this.trees[method] = root;
    }

    root.add(path, handler);
  }

  find(
    method: string,
    context: Context,
  ): RequestHandler {
    const node = this.trees[method];
    let path = context.url.pathname;

    path = removeTrailingSlash(path);

    let requestHandler: RequestHandler | undefined;

    if (node) {
      const [handle] = node.find(path);
      if (handle) {
        requestHandler = handle;
      }
    }

    return requestHandler ?? (() => new Response("Not found", { status: 404 }));
  }
}
