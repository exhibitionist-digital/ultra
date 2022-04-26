// Symbols are used so class properties are only accessible internally
const isRouteKey = Symbol("isRoute");
const pathKey = Symbol("path");

type Node = Record<string | symbol, unknown>;

interface RouteHandler {
  path: string;
  params: Record<string, string>;
}

const DEFAULT_ROUTE_RESPONSE: RouteHandler = {
  path: "",
  params: {} as Record<string, string>,
};

const rxIsDynamic = /\[(\S+)\]/;

/** Store available route handlers in a tree for easy URL comparison */
class RouteHandler {
  /** Holds all child nodes which may be routes */
  root = {} as Node;

  /** Currently set branch acting as root */
  rootCursor = this.root;

  /** Is the path matching this branch a route? */
  [isRouteKey]: boolean;

  /** Path to file which contains request handler for this route */
  [pathKey]: string;

  constructor() {}

  /** Add handler to the tree from a given file path */
  addHandler(path: string) {
    let node = this.rootCursor;

    // Trim off extension and split into parts on `/`
    const parts = path.substring(0, path.length - 3).split("/");
    const file = parts.pop() ?? "";

    // index.[js|ts] not part of route, but dynamic route params are
    if (file !== "index" && rxIsDynamic.test(file)) {
      parts.push(file);
    }

    // Traverse tree, creating nested nodes if absent
    parts.forEach((part) => {
      // Add a default node at part if one does not exist
      if (!(part in node)) {
        node[part] = {} as Node;
      }

      // Set nested node as working node
      node = node[part] as Node;
    });

    node[isRouteKey] = true;
    node[pathKey] = path;
  }

  /** Search tree for matching url, returning path to handler and params */
  getHandler(url: string) {
    let node = this.rootCursor;
    const params = {} as Record<string, string>;

    url.split("/").filter((part) => part !== "").forEach((part) => {
      let partKey = part;

      // If part not found, test for dynamic route param
      if (!(partKey in node)) {
        const paramKey = Object.keys(node).find((key) => rxIsDynamic.test(key));

        if (paramKey) {
          params[paramKey.substring(1, paramKey.length - 1)] = part;
          partKey = paramKey;
        } else {
          return DEFAULT_ROUTE_RESPONSE;
        }
      }

      // Set nested node as working node
      node = node[partKey] as Node;
    });

    if (node[isRouteKey]) {
      return { path: node[pathKey], params } as RouteHandler;
    }

    return DEFAULT_ROUTE_RESPONSE;
  }

  /** Temporarily move the root cursor to limit scope of route retrieval */
  setRoot(path?: string) {
    // Reset root back to default
    if (path === undefined || path === "" || path === "/") {
      this.rootCursor = this.root;
      return;
    }

    let node = this.root;
    path.split("/").forEach((part) => {
      // Do nothing if part is a dead end
      if (!(part in node)) {
        return;
      }

      // Set nested node as working node
      node = node[part] as Node;
    });

    this.rootCursor = node;
  }
}

// Export as singleton
export default new RouteHandler();
