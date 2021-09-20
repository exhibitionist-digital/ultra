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
      <h3>Check out these examples</h3>
      <section>
        {examples.map((
          ex,
        ) => (
          <a target="_blank" href={ex.url} className="ex" rel="noopener">
            <div className="emoji">{ex.emoji}</div>
            <strong>{ex.title}</strong>
            <p>{ex.description}</p>
          </a>
        ))}
      </section>
      <p>
        Source code for these can be found on&nbsp;
        <a href={link} target="_blank" rel="noopener">GitHub</a>
      </p>
      <h4>Go ahead, run Lighthouse, we dare you</h4>
      <img
        className="lighthouse"
        width="100%"
        height="auto"
        alt="perfect lighthouse score"
        src="/lighthouse.png"
      />
    </>
  );
};

const Index = () => {
  return (
    <main>
      <img
        className="logo"
        alt="ultra"
        src="/logo.svg"
        height="350"
      />
      <h1>Ultra</h1>
      <h2>Deno + React: No&nbsp;build, no&nbsp;bundle, all&nbsp;streaming</h2>
      <a
        className="gh"
        target="_blank"
        href="https://github.com/exhibitionist-digital/ultra"
        rel="noopener"
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
