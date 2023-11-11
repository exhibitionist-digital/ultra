import { join } from "https://deno.land/std@0.203.0/url/mod.ts";
import { compile } from "https://deno.land/x/mesozoic@v1.3.10/lib/compiler.ts";
import { type RequestHandler } from "../handler.ts";
import { log } from "ultra/lib/logger.ts";

type CompilerOptions = {
  root: URL | string;
  allowList?: string[];
  denyList?: string[];
};

export function createCompilerHandler(
  options: CompilerOptions,
): RequestHandler {
  const root = new URL(options.root.toString(), import.meta.url);
  const prefix = "/_ultra/";
  const pattern = new URLPattern({
    pathname: `${prefix}:path*`,
  });

  const handleRequest = async (request: Request): Promise<Response> => {
    log.debug(`[react/compiler.ts] Root ${root}`)
    const { pathname } = new URL(request.url);
    log.debug(`[react/compiler.ts] Received ${pathname}`)
    const filePath = pathname.replace(prefix, "./");
    log.debug(`[react/compiler.ts] Tramsformed ${filePath}`)
    const fileUrl = join(root, filePath);

    log.debug(`[react/compiler.ts] Compiling ${fileUrl}`)
    const source = await Deno.readTextFile(fileUrl);
    const result = await compile(fileUrl.toString(), source, {
      jsxImportSource: "react",
      development: true,
    });

    return new Response(result, {
      headers: {
        "Content-Type": "application/javascript",
      },
    });
  };

  const supportsRequest = (request: Request): boolean => {
    return pattern.test(request.url);
  };

  return {
    supportsRequest,
    handleRequest,
  };
}
