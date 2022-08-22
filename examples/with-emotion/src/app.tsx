import styled from "@emotion/styled";

const Text = styled.div`
  font-size: 3em;
`;

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>with-emotion</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/public/favicon.ico" />
      </head>
      <body>
        <Text>
          Hello with-emotion!
        </Text>
      </body>
    </html>
  );
}
