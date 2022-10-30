import { useTw } from "./hooks/useTw.ts";

export default function App() {
  const tw = useTw();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>with-twind</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <div className={tw(`text(3xl white) bg-blue-500 p-3`)}>
          Hello with-twind!
        </div>
        <div className={tw(`text(3xl white) bg-blue-500 p-3`)}>
          Hello with-twind!
        </div>
        <div className={tw(`text(3xl white) bg-blue-500 p-3`)}>
          Hello with-twind!
        </div>
        <div className={tw(`text(3xl white) bg-blue-500 p-3`)}>
          Hello with-twind!
        </div>
      </body>
    </html>
  );
}
