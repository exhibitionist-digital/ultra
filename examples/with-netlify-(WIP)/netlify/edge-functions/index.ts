import type { Context } from "https://edge.netlify.com";
import handler from "../../server.tsx";

export default function (
  request: Request,
  _context: Context,
): Promise<Response> | Response {
  return handler(request);
}
