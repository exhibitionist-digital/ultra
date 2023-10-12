export interface RequestHandler {
  handleRequest: (request: Request) => Promise<Response>;
  supportsRequest: (request: Request) => boolean;
}
