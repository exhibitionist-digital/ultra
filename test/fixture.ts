import { serve } from "https://deno.land/std@0.193.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.193.0/http/file_server.ts";
import { join } from "https://deno.land/std@0.193.0/path/mod.ts";

const abortController = new AbortController();

serve((request) => {
  return serveDir(request, {
    fsRoot: Deno.cwd(),
  });
}, {
  port: 3000,
  signal: abortController.signal,
  async onListen() {
    const test = await new Deno.Command(Deno.execPath(), {
      args: [
        "test",
        "-A",
      ],
      cwd: join(Deno.cwd(), "test", "fixture"),
    }).spawn();

    const status = await test.status;
    abortController.abort();

    Deno.exit(status.code);
  },
});
