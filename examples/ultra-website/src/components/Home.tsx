import { Link } from "wouter";
import Content from "../mdx/anti-bundle.js";

export default function HomePage() {
  return (
    <>
      <section className="home">
        <figure>
          <h1>un-bundle the web</h1>
          <h2>Hypermodern Zero-Legacy Deno/React Framework</h2>
          <img src="/grid_2.webp" alt="green galaxy texture" />
          <img src="/grid_1.webp" alt="purple galaxy texture" />
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
            deno run -A -r https://deno.land/x/ultra/init.ts
            </code>
          </pre>

          <Link to="/philosophy">Philosophy</Link> or{" "}
          <Link to="/docs">Docs</Link> : <em>Choose wisely</em>
        </div>
      </section>
    </>
  );
}
