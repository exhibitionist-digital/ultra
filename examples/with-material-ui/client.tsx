import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";
import theme from "./theme.ts";

const cache = createCache({
  key: "css",
});

hydrate(
  document,
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </CacheProvider>,
);
