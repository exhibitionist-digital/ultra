import Scope, { css } from "@ultra/scope/Scope.jsx";

const Blinky = () => {
  return (
    <Scope
      css={`
        div {
          font-family: monospace;
          flex: 1 1 100%;
          text-align: center;
          margin: 1rem auto 3rem;
          font-size: clamp(2em, 10vw, 8em);
          font-weight: 400;
        }

        div span::before {
          content: "@";
          animation: blink 3s infinite;
        }

        @keyframes blink {
          0%,
          50%,
          70%,
          95% {
            content: "@";
          }

          65%,
          90% {
            content: "—";
          }
        }
      `}
    >
      <div>
        <span></span>__<span></span>
      </div>
    </Scope>
  );
};

export default Blinky;
