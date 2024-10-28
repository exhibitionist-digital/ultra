import Scope, { css } from "@ultra/scope/Scope.jsx";
import Blinky from "../components/Blinky.jsx";

/** @type {import('hono/jsx').FC} */
const Layout = (props) => {
  return (
    <html>
      <style>{globalStyles}</style>
      <body>
        <main>
          <Blinky />
          <h1>3</h1>
          {props.children}
        </main>
      </body>
    </html>
  );
};

export default Layout;

const globalStyles = css`
  html {
    background: #ddd;
  }
  body {
    display: flex;
    min-height: 100svh;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0;
  }
  h1 {
    font-family: monospace;
    font-size: clamp(2em, 5vw, 5em);
    text-align: center;
    font-weight: 200;
  }
`;
