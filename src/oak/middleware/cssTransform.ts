import { Middleware } from "https://deno.land/x/oak@v10.5.1/middleware.ts";
import { isReadableStream, readAllFromReadableStream } from "../../stream.ts";
import { transformCss } from "../../transformer/css.ts";

export const cssTransformMiddleware: Middleware = async (
  { request, response },
  next,
) => {
  if (
    request.url.pathname.endsWith(".css") && isReadableStream(response.body)
  ) {
    const t0 = performance.now();
    const source = await readAllFromReadableStream(response.body);
    const transformed = transformCss(source, {
      output: {
        minify: true,
      },
    });
    response.body = new Blob([transformed]);

    const t1 = performance.now();
    const duration = (t1 - t0).toFixed(2);

    console.log(`Transformed CSS ${request.url.pathname} in ${duration}ms`);
  }
  await next();
};
