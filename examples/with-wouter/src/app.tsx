import { Link, Route, Switch, useSearch } from "wouter";
import HomePage from "./pages/Home.tsx";
import AboutPage from "./pages/About.tsx";

export default function App() {
  const search = useSearch();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>with-wouter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/about?foo=bar">About: Foo Bar</Link>
        </nav>
        <main>
          <div>Search params: {search}</div>
          <Switch>
            <Route path="/">
              <HomePage />
            </Route>
            <Route path="/about">
              <AboutPage />
            </Route>
            <Route>404</Route>
          </Switch>
        </main>
      </body>
    </html>
  );
}
