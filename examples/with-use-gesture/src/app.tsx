import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

export default function App() {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  // @ts-ignore any
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    api.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down });
  });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>With with-api-routes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <div>Hello with-use-gesture! Drag the box!</div>
        <animated.div
          {...bind()}
          style={{
            x,
            y,
            height: "5em",
            width: "5em",
            background: "#ff9900",
            borderRadius: "0.5em",
          }}
        />
      </body>
    </html>
  );
}
