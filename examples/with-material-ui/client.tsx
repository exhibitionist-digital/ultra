import { hydrateRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./src/app.tsx";
import theme from "./theme.ts";

hydrateRoot(
  document,
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
);
