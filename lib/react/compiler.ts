import { join } from "https://deno.land/std@0.203.0/url/mod.ts";
import { compile } from "https://deno.land/x/mesozoic@v1.3.10/lib/compiler.ts";

type CompilerOptions = {
  root: URL | string;
};

export function createCompiler(options: CompilerOptions) {
  const root = new URL(options.root.toString(), import.meta.url);

  const pattern = new URLPattern({
    pathname: "/_ultra/:path*",
  });

  const handleRequest = async (request: Request): Promise<Response> => {
    const { pathname } = new URL(request.url);
    const filePath = pathname.replace(/^\/_ultra\//, "");
    const fileUrl = join(root, filePath);

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
