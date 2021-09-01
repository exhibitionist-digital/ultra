import React, { Suspense } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

const link =
  "https://github.com/exhibitionist-digital/ultra/tree/master/examples";

const Examples = () => {
  const { data } = useSWR(`ULTRA_URL/data.json`, fetcher);
  const { examples } = data;
  return (
    <>
      <h4>Check out these examples</h4>
      <section>
        {examples.map((ex) => (
          <a target="_blank" href={ex.url} className="ex">
            <h3>{ex.emoji}</h3>
            <strong>{ex.title}</strong>
            <p>{ex.description}</p>
          </a>
        ))}
      </section>
      <p>
        Source code for these can be found on&nbsp;
        <a href={link} target="_blank">GitHub</a>
      </p>
    </>
  );
};

const Index = () => {
  return (
    <main>
      <img
        className="logo"
        src="/logo.svg"
        height="350"
      />
      <h1>Ultra</h1>
      <h2>Deno + React: No&nbsp;build, no&nbsp;bundle, all&nbsp;streaming</h2>
      <a
        className="gh"
        target="_blank"
        href="https://github.com/exhibitionist-digital/ultra"
      >
        View on GitHub
      </a>
      <Suspense fallback={null}>
        <Examples />
      </Suspense>
    </main>
  );
};

export default Index;
