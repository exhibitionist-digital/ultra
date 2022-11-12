import { Link } from "wouter";
import Content from "../content/anti-bundle.js";
import { MDXProvider } from "@mdx-js/react";
import useAsset from "ultra/hooks/use-asset.js";
import { Ultra } from "../app.tsx";

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
      <section className="home page">
        <h1>Ultra</h1>
        <p>
          Ultra is an all ESM React/Deno framework that is built for Suspense
          Server Side Rendering. <br />Write ESM, ship ESM, simplify your life.
        </p>
      </section>
      <hr />
      <section className="story">
        <Content />
      </section>
    </MDXProvider>
  );
}
