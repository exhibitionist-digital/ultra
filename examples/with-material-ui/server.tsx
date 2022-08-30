import { serve } from "https://deno.land/std@0.153.0/http/server.ts";
import { createServer } from "ultra/server.ts";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./src/app.tsx";
import theme from "./theme.ts";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
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

  return context.body(result, 200, {
    "content-type": "text/html",
  });
});

serve(server.fetch);
