import { styled } from "./stitches.config.ts";
import { ThemeProvider } from "./theme.tsx";

const Text = styled("div", {
  fontSize: "3em",
  background: "blue",
  color: "white",
  padding: "$1",
});

export default function App() {
  return (
    <ThemeProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>with-stitches</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="/public/favicon.ico" />
        </head>
        <body>
          <Text css={{ color: "red" }}>
            Hello with-stitches!
          </Text>
        </body>
      </html>
    </ThemeProvider>
  );
}
