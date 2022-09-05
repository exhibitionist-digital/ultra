import { hydrateRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import App from "./src/app.tsx";
import theme from "./theme.ts";

const cache = createCache({
  key: "css",
});

hydrateRoot(
  document,
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </CacheProvider>,
);
