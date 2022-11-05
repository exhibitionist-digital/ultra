import { Link } from "wouter";
import Content from "../content/anti-bundle.js";
import { MDXProvider } from "@mdx-js/react";
import useAsset from "ultra/hooks/use-asset.js";

const Image = ({ src, alt }: { src: string; alt: string }) => {
  return <img src={useAsset(src)} alt={alt} />;
};

export default function HomePage() {
  return (
    <MDXProvider
      components={{
        img: Image,
      }}
    >
      <section className="home">
        <figure>
          <h1>un-bundle the web</h1>
          <h2>Zero-Legacy Deno/React Suspense SSR Framework</h2>
          <img src={useAsset("/grid_2.webp")} alt="green galaxy texture" />
          <img src={useAsset("/grid_1.webp")} alt="purple galaxy texture" />
        </figure>
      </section>
      <section className="story">
        <Content />
        <div style={{ margin: "0 1rem" }}>
          <h4 style={{ fontSize: "300%" }}>🧙</h4>
          <p>
            Now it's up to you, oh wise and adventurous one.
          </p>
          <pre>
            <code>
            deno run -A -r https://deno.land/x/ultra/create.ts
            </code>
          </pre>

          <Link to="/philosophy">Philosophy</Link> or{" "}
          <Link to="/docs">Docs</Link> : <em>Choose wisely</em>
        </div>
      </section>
    </MDXProvider>
  );
}
