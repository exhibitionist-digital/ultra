import { serve } from "https://deno.land/std@0.173.0/http/server.ts";
import { createServer } from "ultra/server.ts";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./src/app.tsx";
import theme from "./theme.ts";
import { emotionTransformStream } from "./server/emotion.ts";

const server = await createServer({
  importMapPath: Deno.env.get("ULTRA_MODE") === "development"
    ? import.meta.resolve("./importMap.dev.json")
    : import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

server.get("*", async (context) => {
  /**
   * Render the request
   */
  const result = await server.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>,
    {
      generateStaticHTML: true,
    },
  );

  const transformed = emotionTransformStream(result);

  return context.body(transformed, 200, {
    "content-type": "text/html",
  });
});

serve(server.fetch);
