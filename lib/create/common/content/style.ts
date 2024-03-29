export function styleContent() {
  // deno-fmt-ignore
  return`html,
body {
  margin: 0;
  padding: 1rem;
  font-family: monospace;
  background: #ddd;
  text-align: center;
}

h1 {
  text-align: center;
  margin: 1rem auto 3rem;
  font-size: clamp(2em, 10vw, 8em);
  font-weight: 400;
}

h1 span::before {
  content: '@';
  animation: blink 3s infinite;
}

@keyframes blink {

  0%,
  50%,
  70%,
  95% {
    content: '@';
  }

  65%,
  90% {
    content: '—';
  }
}

p {
  margin: 0 auto 1em;
}
`;
}
